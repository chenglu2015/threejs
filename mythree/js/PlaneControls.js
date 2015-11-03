
// a camera control which is the view like in a plane

THREE.PlaneControls = function (object, lookAt, domElement) {

	// body...
	this.object = object;
	this.center = lookAt;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// body...

	this.enabled = true;

	//mouse move
	this.forwardSpeed = 1.0;  //mouse.y change

	this.maxZoomAngle = Math.PI / 2 - 0.001;
	this.minZoomAngle = 0;

	var moveX = 0;
	var moveY = 0;

	var thetaDelta = 0;  //rotation
    var zoomAngle = 0;
    var zoomAngleDelta = 0;

	var scope = this;

    this.getZoomAngle = function () {
        return zoomAngle;
    }

	//distance is a vector3
    this.pan = function ( distance ) {

        var y = this.object.position.y - this.center.y;
        var z = this.object.position.z - this.center.z;
        var x = this.object.position.x - this.center.x;
        distance.y = - y / Math.sqrt( x * x + z * z ) * distance.z;

        distance.transformDirection( this.object.matrix );
        distance.multiplyScalar( scope.forwardSpeed );

        this.object.position.add( distance );
        this.center.add( distance );

    };


    this.rotateLeft = function ( rand ) {

        thetaDelta -= ( rand / window.innerWidth ) * Math.PI / 2;

    };

    this.zoom = function ( rand ){

        zoomAngleDelta += (rand / 120) * Math.PI / 20;

    }

    this.update = function (){
   
    	var position = this.object.position;
    	var offset = this.center.clone().sub(position);

    	// angle from z-axis around y-axis
        var theta = Math.atan2( offset.x, offset.z );

        // angle from y-axis
        var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

        theta -= thetaDelta;
        zoomAngle += zoomAngleDelta;
        if(zoomAngle > scope.maxZoomAngle){
            var delta = zoomAngle - scope.maxZoomAngle;
            zoomAngle -= delta;
            zoomAngleDelta -= delta;
        }
        else if(zoomAngle < scope.minZoomAngle){
            var delta = zoomAngle - scope.minZoomAngle;
            zoomAngle -= delta;
            zoomAngleDelta -= delta;
        }
        phi += zoomAngleDelta;

        var radius = offset.length();

        offset.x = radius * Math.sin( phi ) * Math.sin( theta );
        offset.y = radius * Math.cos( phi );
        offset.z = radius * Math.sin( phi ) * Math.cos( theta );

        this.center.copy(position).add( offset );

        this.object.lookAt( this.center );

        thetaDelta = 0;
        zoomAngleDelta = 0;

    }

	function onMouseDown(event){

		if(scope.enabled === false) return;

		event.preventDefault();


		document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
	}

	function onMouseMove(event){
		if(scope.enabled === false) return;

		event.preventDefault();

		moveX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        moveY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // addDistance( - moveY / 100 );
        scope.pan( new THREE.Vector3(0, 0, -moveY));
        scope.rotateLeft(moveX);

	}

	function onMouseUp(event){

		if ( scope.enabled === false ) return;

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseWheel(event){
		if ( scope.enabled === false ) return;

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail;

        }

        scope.zoom(delta);


	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    // this.domElement.addEventListener( 'keydown', onKeyDown, false );
}