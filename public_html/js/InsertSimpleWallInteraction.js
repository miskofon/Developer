/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function InsertSimpleWallInteraction() {
    this.floor = null;
    this.wall = null;
    this.startPoint = null;
    this.selectionObject = null;
    this.start = function () {
        this.floor = window.objectsStorer.getObjects(function (object) {
            if (object instanceof SimpleFloor)
                return true;
            else
                return false;
        })[0];
        this.selectionObject = new SelectionPointer();
        this.selectionObject.createMesh();
    };
    this.onMouseMove = function (event, intersections) {
        var intersection = null;
        for (i = 0; i < intersections.length; ++i) {
            if (intersections[i].object.id == this.floor.mesh.id) {
                intersection = intersections[i];
                break;
            }
        }

        if (this.wall != undefined && this.wall != null) {
            if (intersection != null) {
                this.wall.recreateMesh(this.startPoint, new THREE.Vector2(intersection.point.x, intersection.point.y));
                var mesh = this.wall.getMesh();
                mesh.position.z = 0;
                if (this.selectionObject != null) {
                    this.selectionObject.getMesh().position.copy(intersection.point);
                }
            }
        }

        if (intersection != null) {
            if (this.selectionObject != null) {
                this.selectionObject.getMesh().position.copy(intersection.point);
                this.selectionObject.visible = true;
            } else {
                this.selectionObject.visible = false;
            }
        }
    };

    this.onKeyPressed = function (event) {

    };

    this.onClick = function (event, intersections) {
        if (this.wall == undefined || this.wall == null) {
            if (intersections.length > 0) {
                this.wall = new SimpleWall();
                var point = intersections[0].point;
                var pos = new THREE.Vector2(point.x, point.y);
                this.wall.createMesh(pos);
                this.startPoint = pos;
            }
        } else {
            window.objectsStorer.addObject(this.wall);
            //this.engine.objects.push(this.wall);
            this.wall = null;
            this.startPoint = null;
            window.engine.updateObjectsList();
        }
    };

    this.getObjects2Display = function () {
        var objects = [];
        if (this.wall != undefined && this.wall != null) {
            objects.push(this.wall);
        }
        if (this.selectionObject != null) {
            objects.push(this.selectionObject);
        }
        ;
        return objects;
    };
};
