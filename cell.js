import * as THREE from 'three';


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

export { Cell }