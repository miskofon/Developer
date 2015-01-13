
window.engine = new DevEngine() || {};

DisplayedObject.prototype = new DevObject();
function DisplayedObject() {
    this.visible = false;
    this.mesh = null;
};


DisplayedObject.prototype.getMesh = function () {
    return this.mesh;
};

DisplayedObject.prototype.isVisible = function () {
    if (this.mesh == null) {
        return false;
    }
    return this.visible;
};

function DevEngine() {
    this.activeIntercation = null;
    this.lights = [];
    this.temporaryObjects = [];
    this.objects = [];
    this.renderer = {};
    this.mapObjects = new Map();
}
;

DevEngine.prototype.init = function () {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    var container = $("#outputDiv")[0];

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(0xf0f0f0);

    //create default light
    this.addLight(new THREE.AmbientLight(0x505050));

    //create default camera
    this.camera = new THREE.PerspectiveCamera(50, this.WIDTH / this.HEIGHT, 1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = -300;
    this.camera.position.z = 50;
    this.camera.lookAt(this.scene.position);

    container.appendChild(this.renderer.domElement);

    //register events handlers
    var that = this;
    $(window).resize( function () {
        that.onWindowResize();
    });
    $(window).mousemove( function (event) {
        that.onMouseMove(event);
    });
    $(window).mousedown( function () {
        that.onMouseDown();
    });
    $(window).mouseup( function () {
        that.onMouseUp();
    });
    $(window).click( function (event) {
        that.onClick(event);
    });
    $(window).keypress(function (event) {
        that.onKeyPressed(event);
    });
    $(window).keyup(function (event) {
        that.onKeyUp(event);
    });
};

DevEngine.prototype.updateObjectsList = function() {
    this.objects = window.objectsStorer.getObjects(function(object){
        if (object instanceof DisplayedObject) {
            return true;
        } else {
            return false;
        }
    });
};

DevEngine.prototype.onKeyPressed = function (event) {
    if (this.activeInteraction != undefined) {
        if (typeof this.activeInteraction.onKeyPressed == 'function') {
            this.activeInteraction.onKeyPressed(event);
        }
    }
};

DevEngine.prototype.onKeyUp = function (event) {
    if (this.activeInteraction != undefined) {
        if (event.keyCode == 27) {
            this.activeInteraction = undefined;
            $("#addWall").removeClass("action-button-running");
            return;
        }
    }
};

DevEngine.prototype.onMouseMove = function (event) {
    if (this.activeInteraction != undefined) {
        if (typeof this.activeInteraction.onMouseMove == 'function') {
            event.preventDefault();
            var mouse = new THREE.Vector2()
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(this.camera);

            var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
            var intersections = raycaster.intersectObject(this.scene, true);

            this.activeInteraction.onMouseMove(event, intersections);
        }
    }
};

DevEngine.prototype.onMouseUp = function (event) {
    if (this.activeInteraction != undefined) {
        if (typeof this.activeInteraction.onMouseUp == 'function') {
            this.activeInteraction.onMouseUp(event);
        }
    }
};

DevEngine.prototype.onMouseDown = function (event) {
    if (this.activeInteraction != undefined) {
        if (typeof this.activeInteraction.onMouseDown == 'function') {
            this.activeInteraction.onMouseDown(event);
        }
    }
};

DevEngine.prototype.onClick = function (event) {
    if (this.activeInteraction != undefined) {
        if (typeof this.activeInteraction.onClick == 'function') {
            event.preventDefault();
            var mouse = new THREE.Vector2()
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(this.camera);

            var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
            var intersections = raycaster.intersectObject(this.scene, true);

            this.activeInteraction.onClick(event, intersections);
        }
    }
};

DevEngine.prototype.addLight = function (light) {
    this.lights.push(light);
};

DevEngine.prototype.start = function () {
    var that = this;
    
    //register function rendering view
    requestAnimationFrame(function () {
        that.animate();
    });
    
    //get all object which will be displayed from data store
    this.updateObjectsList();
};

DevEngine.prototype.startAddWall = function () {
    this.activeInteraction = new InsertSimpleWallInteraction(this);
    this.activeInteraction.start();

    $("#addWall").addClass("action-button-running");
};

DevEngine.prototype.animate = function () {
    var that = this;

    //handle interactions
    that.temporaryObjects = [];
    if (this.activeInteraction != undefined) {
        var objects = this.activeInteraction.getObjects2Display();
        $.each(objects, function (objectIndex, object) {
            that.temporaryObjects.push(object);
        });
    }

    //clear scene
    $.each(this.scene.children, function (index, object) {
        that.scene.remove(object);
    });

    this.mapObjects.clear();

    //add lights
    $.each(this.lights, function (index, light) {
        that.scene.add(light);
    });

    //add objects
    $.each(this.objects, function (index, object) {
        if (object.isVisible()) {
            var mesh = object.getMesh();
            that.scene.add(mesh);
            that.mapObjects.set(mesh, object);
        }
    });

    //add temporary objects
    $.each(this.temporaryObjects, function (index, object) {
        if (object.isVisible()) {
            var mesh = object.getMesh();
            that.scene.add(mesh);
            that.mapObjects.set(mesh, object);
        }
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(function () {
        that.animate();
    });
};

DevEngine.prototype.onWindowResize = function () {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
};
