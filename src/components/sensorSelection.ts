import * as BABYLON from 'babylonjs'
import * as GUI from "babylonjs-gui";


export default function sensorSelectionScript(scene: BABYLON.Scene, modelMeshes) {

    let sensors = ['node358', 'node10'];

    let container = {
        meshes: modelMeshes
    }

    for (var i = 0; i < container.meshes.length; i++) {
        if (sensors.includes(container.meshes[i].name)) {
          // found sensor
          var mat: BABYLON.PBRMaterial;
          mat = container.meshes[i].material;
          console.log(mat);
          mat.albedoColor = BABYLON.Color3.Purple();

          var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
          var rect = new GUI.Rectangle();
          rect.width = "70px";
          rect.height = "70px";
          rect.thickness = 0;
          advancedTexture.addControl(rect);

          var circle = new GUI.Ellipse();
          circle.width = "70px";
          circle.height = "70px";
          circle.color = "white";
          circle.background = "white"
          circle.thickness = 10;
          rect.addControl(circle);

          var label = new GUI.TextBlock();
          label.text = container.meshes[i].name;
          rect.addControl(label);

          rect.linkWithMesh(container.meshes[i]);
          //rect.linkOffsetY = -50;

          // MESH ACTIONS
          container.meshes[i].actionManager = new BABYLON.ActionManager(scene);
          /*
          container.meshes[i].actionManager.registerAction(
            new BABYLON.InterpolateValueAction(
              BABYLON.ActionManager.OnPointerOverTrigger,
              container.meshes[i].material,
              '_albedoColor',
              BABYLON.Color3.Black(),
              200
            )
          );

          container.meshes[i].actionManager.registerAction(
            new BABYLON.InterpolateValueAction(
              BABYLON.ActionManager.OnPointerOutTrigger,
              container.meshes[i].material,
              '_albedoColor',
              container.meshes[i].material._albedoColor,
              200
            )
          );
          */

          //change mesh color on click, change state
          container.meshes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPickTrigger, function(e) {
                console.log("picked: ", e.source);
                if (e.source.state === "selected") {
                  e.source.state = "";
                  e.source.material.albedoColor = BABYLON.Color3.Purple();
                } else {
                  // TODO: API CALL FOR SENSOR INFO TO DISPLAY
                  e.source.state = "selected";
                  e.source.material.albedoColor = BABYLON.Color3.Teal();
                }
              }));

          // change color on hover
          container.meshes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOverTrigger, function(e) {
                e.source.material.albedoColor = BABYLON.Color3.Teal();
              }));

          // revert color on hover leave
          container.meshes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOutTrigger, function(e) {
                if (e.source.state != 'selected') {
                  e.source.material.albedoColor = BABYLON.Color3.Purple();
                }
              }));

        }
    }
}