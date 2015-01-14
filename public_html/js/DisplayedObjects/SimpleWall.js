/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

SimpleWall.prototype = new DisplayedObject();
function SimpleWall() {
    this.createMesh = function (pos) {
        this.mesh = this.generateMesh(pos, pos, 2, 20);
        this.visible = true;
        this.objectType = "wall";
    };

    this.recreateMesh = function (startPos, endPos) {
        var oldMesh = this.getMesh();
        if (oldMesh == undefined | oldMesh == null) {
            return;
        }

        this.mesh = this.generateMesh(startPos, endPos, 2, 20);
    };

    this.generateMesh = function (start, end, width, height) {
        var wallMesh = new THREE.Object3D();

        var length = end.distanceTo(start);
        if (length < width) {
            length = width;
        }

        var div = new THREE.Vector2().subVectors(end, start);
        var wallColor = 0x808080;

        //create front plane
        var inter = new THREE.Mesh(new THREE.PlaneGeometry(length, height), new THREE.MeshBasicMaterial({color: wallColor}));
        inter.lookAt(new THREE.Vector3(1.0, 0.0, 0.0));
        inter.rotation.x = Math.PI / 2;
        inter.position.x = width / 2;
        inter.position.y = -length / 2;
        inter.position.z = height / 2;
        inter.devObject = this;
        wallMesh.add(inter);

        var outSide = new THREE.Mesh(new THREE.PlaneGeometry(length, height), new THREE.MeshBasicMaterial({color: wallColor}));
        outSide.lookAt(new THREE.Vector3(-1.0, 0.0, 0.0));
        outSide.rotation.x = Math.PI / 2;
        outSide.position.x = -width / 2;
        outSide.position.y = -length / 2;
        outSide.position.z = height / 2;
        outSide.devObject = this;
        wallMesh.add(outSide);

        var back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({color: wallColor}));
        back.lookAt(new THREE.Vector3(0.0, 1.0, 0.0));
        back.rotation.z = 0;
        back.position.y = 0;
        back.position.z = height / 2;
        back.doubleSide = true;
        back.devObject = this;
        wallMesh.add(back);

        var front = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({color: wallColor}));
        front.lookAt(new THREE.Vector3(0.0, -1.0, 0.0));
        front.rotation.z = 0;
        front.position.x = 0;
        front.position.y = -length;
        front.position.z = height / 2;
        front.devObject = this;
        wallMesh.add(front);

        var top = new THREE.Mesh(new THREE.PlaneGeometry(width, length), new THREE.MeshBasicMaterial({color: 0xffffff}));
        top.lookAt(new THREE.Vector3(0.0, 0.0, 1.0));
        top.position.x = 0;
        top.position.y = -length / 2;
        top.position.z = height;
        top.devObject = this;
        wallMesh.add(top);

        if (div.x != 0 || div.y != 0) {
            wallMesh.rotation.z = new THREE.Vector3(div.x, div.y, 0).angleTo(new THREE.Vector3(0.0, -1.0, 0.0)) * Math.sign(div.x);
        }
        wallMesh.position.copy(start);
        wallMesh.devObject = this;
        return wallMesh;
    };

    this.setPosition = function (pos) {
        this.mesh.position.copy(pos);
    };
}
;
            