function DisplayedObject() {
	this.visible = false;
	this.mesh = null;
};

DisplayedObject.prototype.getMesh = function() {
	return this.mesh;
};

DisplayedObject.prototype.isVisible = function() {
	if (this.mesh == null) {
		return false;
	}
	return this.visible;
};

function DevEngine() {
	this.walls = [];
	this.interactions = [];
	this.activeIntercation = null;
	this.meshes = [];
	this.floors = [];
	this.lights = [];
	this.temporaryObjects = [];
	this.objects = [];
	this.renderer = {};
	this.mapObjects = new Map();
};

DevEngine.prototype.init = function() {
	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	
	var container = $("#outputDiv")[0];
	
	this.scene = new THREE.Scene();
	this.renderer = new THREE.WebGLRenderer({antialias:true}); 
	
	this.renderer.setSize( this.WIDTH, this.HEIGHT );
	this.renderer.setClearColor(0xf0f0f0);
	
	this.addLight( new THREE.AmbientLight( 0x505050 ) );
	
	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	light.castShadow = true;
	
	this.addLight(light);
	
	this.camera = new THREE.PerspectiveCamera( 50, this.WIDTH / this.HEIGHT, 1, 1000 );
	this.camera.position.x = 0;
	this.camera.position.y = -300;
	this.camera.position.z = 50;
	this.camera.lookAt(this.scene.position);

	container.appendChild( this.renderer.domElement );
	
	var that = this;
	window.addEventListener( 'resize', function() { that.onWindowResize();} , false );
	window.addEventListener( 'mousemove', function(event) { that.onMouseMove(event);} , false );
	window.addEventListener( 'mousedown', function() { that.onMouseDown();} , false );
	window.addEventListener( 'mouseup', function() { that.onMouseUp();} , false );
	window.addEventListener( 'click', function(event) { that.onClick(event);} , false );
	$(document).keypress(function(event) { that.onKeyPressed(event); });
	$(document).keyup(function(event) { that.onKeyUp(event); });
};

DevEngine.prototype.onKeyPressed = function(event) {
	if (this.activeInteraction != undefined) {
		if (typeof this.activeInteraction.onKeyPressed == 'function') {
			this.activeInteraction.onKeyPressed(event);
		}
	}
};

DevEngine.prototype.onKeyUp = function(event) {
	if (this.activeInteraction != undefined) {
		if (event.keyCode == 27) {
			this.activeInteraction = undefined;
			$("#addWall").removeClass("action-button-running");
			return;
		}
	}
};

DevEngine.prototype.onMouseMove = function(event) {
	if (this.activeInteraction != undefined) {
		if (typeof this.activeInteraction.onMouseMove == 'function') {
									event.preventDefault();
			var mouse = new THREE.Vector2()
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;					
			var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( this.camera );

			var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
			var intersections = raycaster.intersectObject(this.scene, true);

			this.activeInteraction.onMouseMove(event, intersections);
		}
	}
};

DevEngine.prototype.onMouseUp = function(event) {
	if (this.activeInteraction != undefined) {
		if (typeof this.activeInteraction.onMouseUp == 'function') {
			this.activeInteraction.onMouseUp(event);
		}
	}
};

DevEngine.prototype.onMouseDown = function(event) {
	if (this.activeInteraction != undefined) {
		if (typeof this.activeInteraction.onMouseDown == 'function') {
			this.activeInteraction.onMouseDown(event);
		}
	}
};

DevEngine.prototype.onClick = function(event) {
	if (this.activeInteraction != undefined) {
		if (typeof this.activeInteraction.onClick == 'function') {
			event.preventDefault();
			var mouse = new THREE.Vector2()
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;					
			var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( this.camera );

			var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
			var intersections = raycaster.intersectObject(this.scene, true);

			this.activeInteraction.onClick(event, intersections);
		}
	}
};

DevEngine.prototype.addMeshElement = function(mesh) {
	if ($.inArray(mesh, this.scene.children) == -1) {
			this.scene.add(mesh);
		}
};

DevEngine.prototype.addFloor = function (floor) {
	this.floors.push(floor);
	this.addObject(floor);
	//this.addMeshElement(floor.getMesh());
};

DevEngine.prototype.addObject = function(object) {
	if (object instanceof DisplayedObject) {
		if ($.inArray(object, this.objects) == -1) {
			this.objects.push(object);
		}
	} else {
		console.log("Object of incorrect type added. Type:" + typeof object);
	}
};

DevEngine.prototype.addLight = function(light) {
	this.lights.push(light);
};

DevEngine.prototype.start = function() {
	var that = this;
	requestAnimationFrame(function() { that.animate();} );
	
	var floor = new SimpleFloor(new THREE.Vector3( 0, 0, 0 ), 400, 400, 0x5050FF);
	floor.createMesh();
	this.addFloor(floor);
	
	//this.activeInteraction = new SimpleInteraction(this, floor);
	//this.interactions.push(this.activeInteraction);
};

DevEngine.prototype.startAddWall = function() {
	this.activeInteraction = new SimpleInteraction(this, this.floors[0]);
	this.interactions.push(this.activeInteraction);
	this.activeInteraction.start();
	
	$("#addWall").addClass("action-button-running");
};

DevEngine.prototype.animate = function() {
	var that = this;
	
	//handle interactions
	that.temporaryObjects = [];
	if (this.activeInteraction != undefined) {
		var objects = this.activeInteraction.getObjects2Display();
		$.each(objects, function(objectIndex, object) {
			that.temporaryObjects.push(object);
		});
	}
	
	//clear scene
	$.each(this.scene.children, function(index, object) {
		that.scene.remove(object);
	});
	
	this.mapObjects.clear();
	
	//add lights
	$.each(this.lights, function(index, light) {
		that.scene.add(light);
	});
	
	//add objects
	$.each(this.objects, function(index, object) {
		if (object.isVisible()) {
			var mesh = object.getMesh();
			that.scene.add(mesh);
			that.mapObjects.set(mesh, object);
		}
	});

	//add temporary objects
	$.each(this.temporaryObjects, function(index, object) {
		if (object.isVisible()) {
			var mesh = object.getMesh();
			that.scene.add(mesh);
			that.mapObjects.set(mesh, object);
		}
	});
	
	this.renderer.render( this.scene, this.camera );
	requestAnimationFrame(function() { that.animate();} );
};

DevEngine.prototype.onWindowResize = function () {
	
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );
}