/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

SimpleFloor.prototype = new DisplayedObject();
SimpleFloor.prototype.constructor = SimpleFloor;
function SimpleFloor(position, depth, width, color) {
    this.pos = position;
    this.width = width;
    this.depth = depth;
    this.color = color;
}
;

SimpleFloor.prototype.createMesh = function () {
    var material = new THREE.MeshBasicMaterial({color: this.color});
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.depth), material);
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;
    this.visible = true;
};

