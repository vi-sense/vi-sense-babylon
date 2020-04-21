import * as BABYLON from 'babylonjs';
import { App } from './components/App';

window.addEventListener('DOMContentLoaded', () => {

	const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
	const infoElement = document.getElementById('infoElement');

	const engine : BABYLON.Engine = new BABYLON.Engine(canvas, true);
	const app : App = new App(canvas, engine);
	
	engine.runRenderLoop(() => {
		app.update();
		infoElement.innerHTML = engine.getFps().toFixed() + " fps";
	})

  });
  