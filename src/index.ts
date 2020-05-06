import App from './components/App';


const production = false

window.addEventListener('DOMContentLoaded', () => {
	const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
	const app = new App(canvas, 'facility-mechanical-room', production);
});
  