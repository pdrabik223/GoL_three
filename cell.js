import * as THREE from 'three';


class Cell {

    constructor(scene, isAlive, x, y) {
        this.isAlive = isAlive
        this.material = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
        this.flor = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.material);
        
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
        this.flor.material.color.setHex(0xAAAAAA)
    }
    activate() {
        this.isAlive = true
        this.flor.material.color.setHex(0x3030FF)
    }

    setState(isAlive) {
        if (this.isAlive == isAlive) return

        if (this.isAlive) this.kill()
        else this.activate()


    }


}

export { Cell }