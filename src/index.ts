import App from './components/App';

window.addEventListener('DOMContentLoaded', () => {

	const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');
	const app = new App(canvas);
});
  