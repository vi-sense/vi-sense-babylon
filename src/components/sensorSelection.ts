import * as BABYLON from 'babylonjs'
import * as GUI from "babylonjs-gui";


async function getModel(id: number) {
  let response = await fetch("http://visense.f4.htw-berlin.de:8080/models/" + id);
  let body = await response.json();
  return body;
}

export default async function sensorSelectionScript(scene: BABYLON.Scene, modelMeshes) {

  let model = await getModel(1);
  let sensors = model.Sensors;
  console.log(sensors)
  let labels = [];

  for (let i = 0; i < sensors.length; i++) {
    let mesh = scene.getMeshByName(sensors[i].MeshID);
    var mat: BABYLON.PBRMaterial;
    mat = mesh.material;
    mat.albedoColor = BABYLON.Color3.Purple();

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var rect = new GUI.Rectangle();
    //rect.widthInPixels = 220;
    //rect.heightInPixels = 100;
    rect.background = "white";
    rect.color = "black";
    rect.alpha = 0.9;
    rect.thickness = 0;
    rect.adaptHeightToChildren = true;
    rect.adaptWidthToChildren = true;
    advancedTexture.addControl(rect);

    var circle = new GUI.Ellipse();
    circle.width = "70px";
    circle.height = "70px";
    circle.color = "white";
    circle.background = "white";
    circle.thickness = 10;
    circle.isVisible = false;
    rect.addControl(circle);

    var label = new GUI.TextBlock();
    label.text = sensors[i].Name;
    //label.textWrapping = true;
    label.resizeToFit = true;
    console.log(rect.widthInPixels, rect.heightInPixels)
    label.widthInPixels = rect.widthInPixels - 10;
    label.heightInPixels = rect.heightInPixels - 10;
    label.onTextChangedObservable.add(function(evt, picked) {
      console.log("EVT: ", evt.parent.widthInPixels);
      //evt.parent.widthInPixels = evt.parent.widthInPixels + 50;
    })
    labels.push(label);
    //console.log(labels);

    rect.addControl(label);
    rect.linkWithMesh(mesh);

    mesh.actionManager = new BABYLON.ActionManager(scene);

    //change mesh color on click, change state
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger, async function(e) {
          console.log("picked: ", e.source);
          if (e.source.state === "selected") {
            e.source.state = "";
            e.source.material.albedoColor = BABYLON.Color3.Purple();
          } else {
            // API CALL GETTING SENSOR DATA
            let response = await fetch("http://visense.f4.htw-berlin.de:8080/sensors/" + sensors[i].ID);
            let sensorData = await response.json();

            console.log("sensorData: ", sensorData);
            console.log("label: ", labels[i]);
            // UPDATE LABEL TEXT
            let text = "Name: " + sensorData.Name + "\nDescription: " + sensorData.Description + "\nValue: " + sensorData.Data[sensorData.Data.length - 1].Value.toString() + sensorData.MeasurementUnit;
            labels[i].text = text;
            e.source.state = "selected";
            e.source.material.albedoColor = BABYLON.Color3.Teal();
          }
        }));

    // hover actions, change color
    mesh.actionManager.registerAction(
      new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        mesh.material,
        'albedoColor',
        BABYLON.Color3.Teal(),
        200
      ));

    mesh.actionManager.registerAction(
      new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        mesh.material,
        'albedoColor',
        BABYLON.Color3.Purple(),
        200,
        new BABYLON.PredicateCondition(
          mesh.actionManager,
          function() {
            return mesh.state !== "selected";
          }
        )
      ));
  }
}
