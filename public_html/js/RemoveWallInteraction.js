/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

CopiedObject.prototype = new DisplayedObject();
function CopiedObject() {
    this.setMesh = function (mesh) {
        this.mesh = mesh;
        this.visible = true;
    };
}
;


function RemoveWallInsteraction() {
    var selectionMaterial = new THREE.MeshLambertMaterial({color: 0xff1000});
    this.overlappedObj = null;
    this.copiedObject = null;
    this.selectedObject = null;
    this.isRunning = false;
    this.start = function () {
        this.isRunning = true;
    };
    this.onMouseMove = function (event, intersections) {
        //check if interaction is in running state
        if (this.isRunning == false) {
            return;
        }

        //check is something has been selected
        if (intersections.length == 0) {
            this.overlappedObj = null;
            this.copiedObject = null;
            return;
        }

        //check if selected object has been already selected
        var object = intersections[0].object.devObject;
        if (object != undefined && this.overlappedObj != null && object == this.overlappedObj) {
            return;
        }
        
        if (object.objectType != "wall") {
            this.overlappedObj = null;
            this.copiedObject = null;
            return;
        }

        //copy selected object
        this.overlappedObj = object;
        var copiedMesh = object.cloneMesh(selectionMaterial);
        this.copiedObject = new CopiedObject();
        this.copiedObject.setMesh(copiedMesh);
    };

    this.onKeyPressed = function (event) {
    };

    this.onClick = function (event, intersections) {
        if (this.overlappedObj == null) {
            return;
        }
        this.copiedObject = null;

        window.objectsStorer.removeObject(this.overlappedObj);
        window.engine.updateObjectsList();
    };

    this.getObjects2Display = function () {
        var objects = [];
        if (this.copiedObject != null) {
            objects.push(this.copiedObject);
        }
        return objects;
    };
}
;
