import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders';

export class App {

    engine : BABYLON.Engine
    scene : BABYLON.Scene

    constructor(canvas : HTMLCanvasElement, engine : BABYLON.Engine){

        this.engine = engine;
        this.scene = new BABYLON.Scene(this.engine);

        var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5,-10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        camera.keysUp.push(87); 
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
        camera.keysDown.push(83);

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);
        var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, this.scene);
        var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, this.scene);
        sphere.position.y = 1;


        var model : BABYLON.AbstractMesh
        BABYLON.SceneLoader.LoadAssetContainer("public/gltf/facility-mechanical-room/", "scene.gltf", this.scene, function (container) {
            container.addAllToScene();
        
            // root mesh of file
            model = container.meshes[0] 
            // how to access subnodes/meshes from root? 
            // give it a name (like the sphere) and access is like that?

            model.position.y = -200
            model.position.x = -50   
        });
    }

    update() : void {
        this.scene.render();
    }
}



