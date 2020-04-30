import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders';
import 'babylonjs-inspector';
import setupCamera from './camera';
import sensorSelectionScript from './sensorSelection';

export default class App {

    engine: BABYLON.Engine
    scene: BABYLON.Scene   
     
    constructor(canvas: HTMLCanvasElement){

        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        //this.scene.debugLayer.show();        

        setupCamera(canvas, this.engine, this.scene)

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1 ,0), this.scene);
        var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, this.scene);
        var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments:16, diameter:2}, this.scene);
        sphere.position.y = 1;


        BABYLON.SceneLoader.ImportMesh("", "gltf/facility-mechanical-room/", "scene.gltf", this.scene, (meshes, particleSystems, skeletons) => {
            let buildingModel = <BABYLON.Mesh> meshes[0] 
            // root mesh of the file, but how to access subnodes/meshes from root? 
            // give it a name (like the sphere) and access is like that? 
            
            //this.buildingModel.scaling.z = 1; // resets default scaling but causes in z-buffer issues in the facility room model
            buildingModel.rotationQuaternion = undefined // resets rotation

            buildingModel.setPivotMatrix(BABYLON.Matrix.Translation(85, -179.5, -80), false); // dont do further transformations here
            buildingModel.rotate(BABYLON.Axis.Y, degToRad(-44), BABYLON.Space.LOCAL)
            buildingModel.bakeCurrentTransformIntoVertices();
            buildingModel.setPivotMatrix(BABYLON.Matrix.Identity()); // resets gizmos to origin  
            
            sensorSelectionScript(this.scene, meshes)
        });


        this.engine.runRenderLoop(() => {
            this.scene.render();        
        })

        window.addEventListener('resize', () => { 
            this.engine.resize();
        });
    }
}

function degToRad(deg: number): number {
    return deg * Math.PI / 180
}

