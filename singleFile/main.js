import * as THREE from 'three';

import config from './config.json' with { type: 'json' };
class Cell {

    constructor(scene, isAlive, x, y) {
        this.isAlive = isAlive
        this.material = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0 });

        const geometry = new THREE.PlaneGeometry(0.8, 0.8);
        this.flor = new THREE.Mesh(geometry, this.material);

        if (isAlive)
            this.activate()
        else
            this.kill()

        this.flor.position.x = x
        this.flor.position.y = y
        scene.add(this.flor)
    }

    kill() {
        this.isAlive = false
        this.flor.material.opacity = 0
    }
    activate() {
        this.isAlive = true
        this.flor.material.opacity = 1
    }

    setState(isAlive) {
        if (this.isAlive == isAlive) return

        if (this.isAlive) this.kill()
        else this.activate()
    }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

scene.add(camera);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 100
controls.update();

var grid = []
var booleanGrid = []

function getCell(x, y) {
    if (x < 0)
        x = config["height"] - 1

    if (y < 0)
        y = config["width"] - 1

    if (x >= config["height"])
        x = 0

    if (y >= config["width"])
        y = 0

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

var time = performance.now()
var animationSpeed = 14 // in fps  
function animate() {
    requestAnimationFrame(animate);
    var timeDiff = performance.now() - time
    if (timeDiff > (1000 / animationSpeed)) {
        time = performance.now()
        renderer.render(scene, camera);
        // camera.position.z += 0.1
        step();
    }
    // console.log("frame!")
}
init();
step();
animate();