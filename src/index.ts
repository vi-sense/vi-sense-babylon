import * as BABYLON from 'babylonjs';
import { App } from './components/App';

window.addEventListener('DOMContentLoaded', () => {

	const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
	const infoElement = document.getElementById('infoElement');

	const app: App = new App(canvas);
});
  