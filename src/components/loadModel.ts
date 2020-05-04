import * as BABYLON from 'babylonjs'
import { degToRad } from './utils';
var JSZip = require("jszip");

export function loadModel(url: string, scene: BABYLON.Scene, callback: (meshes: BABYLON.AbstractMesh[]) => void){

    getBaseData( glTFString => {
        BABYLON.SceneLoader.ImportMeshAsync('', '', `data:${glTFString}`, scene)
    })
    
    return;
    BABYLON.SceneLoader.ImportMesh("", "gltf/facility-mechanical-room/", "scene.gltf", scene, (meshes, particleSystems, skeletons) => {

        let buildingModel = <BABYLON.Mesh> meshes[0] 
        // root mesh of the file, but how to access subnodes/meshes from root? 
        // give it a name (like the sphere) and access is like that? 
        
        //this.buildingModel.scaling.z = 1; // resets default scaling but causes in z-buffer issues in the facility room model
        buildingModel.rotationQuaternion = undefined // resets rotation

        buildingModel.setPivotMatrix(BABYLON.Matrix.Translation(85, -179.5, -80), false); // dont do further transformations here
        buildingModel.rotate(BABYLON.Axis.Y, degToRad(-44), BABYLON.Space.LOCAL)
        buildingModel.bakeCurrentTransformIntoVertices();
        buildingModel.setPivotMatrix(BABYLON.Matrix.Identity()); // resets gizmos to origin  
        
        callback(meshes)
    })
}




function getBaseData (callback) {
    var Zip = new JSZip()
    var url = 'http://visense.f4.htw-berlin.de:8080/files/mep-building-model/model.zip/' // Introducing static files
    var xmlhttp = null

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new window.XMLHttpRequest()
    } else { // code for IE6, IE5
        xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
    }

    xmlhttp.open('GET', url, true)
    //xmlhttp.withCredentials = true // TO-DO: Should be working
    // recent browsers
    if ('responseType' in xmlhttp) {
        xmlhttp.responseType = 'arraybuffer'
    }
    // older browser
    if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType('text/plain; charset=x-user-defined')
    }

    xmlhttp.send()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        var file = xmlhttp.response || xmlhttp.responseText

        JSZip
        .loadAsync(file)
        .then(function (zip) {

            let binPromise = zip.file("scene.bin")
            .async("blob")
            .then(function(blob){
                console.log(blob);
                
                let blolbDataURL = window.URL.createObjectURL(blob);

                let glTFPromis = zip.file("scene.gltf")
                .async("string")
                .then(function(sceneString){

                    sceneString = sceneString.split("scene.bin").join(blolbDataURL)
                    callback(sceneString)
                })
            })
        })
        }
    }
 }