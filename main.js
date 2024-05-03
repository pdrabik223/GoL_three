import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Cell } from './cell.js';
import config from './config.json' with { type: 'json' };

const material = new THREE.MeshBasicMaterial({ color: 0x696969 });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


const axesHelper = new THREE.AxesHelper(5);

scene.add(camera);
scene.add(axesHelper);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 120
controls.update();

const flor = new THREE.Mesh(new THREE.BoxGeometry(config["width"], 0.5, config["height"]), material);
flor.position.y = -1
// scene.add(flor);

var grid = []
var booleanGrid = []

function getCell(x, y) {
	if (x < 0 || y < 0) return false
	if (x >= config["height"] || y >= config["width"]) return false
	return grid[x][y].isAlive

}
function init() {
	for (var x = 0; x < config["height"]; x++) {
		grid.push([]);
		booleanGrid.push([])
		for (var y = 0; y < config["width"]; y++) {
			grid[x].push(new Cell(scene, Math.random() > 0.5, x - 50, y - 50))
			booleanGrid[x].push(false)
		}
	}
}

function logic(x, y) {
	var numberOfAliveCells = 0

	if (getCell(x - 1, y - 1)) ++numberOfAliveCells
	if (getCell(x - 1, y)) ++numberOfAliveCells
	if (getCell(x - 1, y + 1)) ++numberOfAliveCells

	if (getCell(x, y - 1)) ++numberOfAliveCells
	if (getCell(x, y + 1)) ++numberOfAliveCells

	if (getCell(x + 1, y - 1)) ++numberOfAliveCells
	if (getCell(x + 1, y)) ++numberOfAliveCells
	if (getCell(x + 1, y + 1)) ++numberOfAliveCells

	if (grid[x][y].isAlive) {
		// Any live cell with fewer than two live neighbors dies, as if by underpopulation.
		if (numberOfAliveCells < 2) return false
		// Any live cell with more than three live neighbors dies, as if by overpopulation.
		if (numberOfAliveCells > 3) return false
		// Any live cell with two or three live neighbors lives on to the next generation.
		return true
	} else {
		// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
		return numberOfAliveCells == 3
	}
}
function step() {
	for (var x = 0; x < config["height"]; x++) {
		for (var y = 0; y < config["width"]; y++) {
			booleanGrid[x][y] = logic(x, y)
		}
	}
	// console.log(booleanGrid[0])
	for (var x = 0; x < config["height"]; x++) {
		for (var y = 0; y < config["width"]; y++) {
			grid[x][y].setState(booleanGrid[x][y])
		}
	}
}
function animate() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	step();
	// console.log("frame!")
}
init();
step();
animate();