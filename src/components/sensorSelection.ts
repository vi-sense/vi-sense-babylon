import * as BABYLON from 'babylonjs'
import * as GUI from "babylonjs-gui";


async function getModel(id: number) {
  let response = await fetch("http://visense.f4.htw-berlin.de:8080/models/" + id);
  let body = await response.json();
  return body;
}

export default async function sensorSelectionScript(scene: BABYLON.Scene, modelMeshes) {
  // GET MODEL
  let model = await getModel(1);
  let sensors = model.Sensors;
  console.log(sensors)

  let labels = [];

  for (let i = 0; i < sensors.length; i++) {
    // CURRENT MESH
    let mesh = scene.getMeshByName(sensors[i].MeshID);
    var mat: BABYLON.PBRMaterial;
    mat = mesh.material;
    mat.albedoColor = BABYLON.Color3.Purple();

    // GET SENSORDATA
    let response = await fetch("http://visense.f4.htw-berlin.de:8080/sensors/" + sensors[i].ID);
    let sensorData = await response.json();

    // GUI SETUP
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
    rect.isPointerBlocker = true;
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
    label.paddingRightInPixels = 20;
    label.paddingLeftInPixels = 20;
    label.widthInPixels = rect.widthInPixels - 10;
    label.heightInPixels = rect.heightInPixels - 10;
    label.onTextChangedObservable.add(function(evt, picked) {
      console.log("EVT: ", evt.parent.widthInPixels);
      evt.parent.widthInPixels = evt.parent.widthInPixels + 50;
    })
    labels.push(label);

    rect.onPointerDownObservable.add(function(e, p) {
      // select mesh
      console.log(e, p.target)
      console.log(mesh);
      if(mesh.state == "") {
        mesh.material.albedoColor = BABYLON.Color3.Teal();
        mesh.state = "selected";
        p.target.text = "Name: " + sensorData.Name + "\nDescription: " + sensorData.Description + "\nValue: " + sensorData.Data[sensorData.Data.length - 1].Value.toString() + sensorData.MeasurementUnit;
      } else {
        mesh.material.albedoColor = BABYLON.Color3.Purple();
        mesh.state = ""
        p.target.text = sensorData.Name
      }
    })

    rect.addControl(label);
    rect.linkWithMesh(mesh);

    // REGISTER MESH ACTIONS
    mesh.actionManager = new BABYLON.ActionManager(scene);
    // change mesh color on click, change state
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger, async function(e) {
          console.log("picked: ", e.source);
          if (e.source.state === "selected") {
            e.source.state = "";
            e.source.material.albedoColor = BABYLON.Color3.Purple();
            labels[i].text = sensorData.Name
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
