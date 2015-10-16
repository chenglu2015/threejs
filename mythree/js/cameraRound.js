
THREE.RoundControls = function (object, domElement) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// body...

	this.enabled = true;

	this.center = new THREE.Vector3();

	//left mouse move
	this.userPan = true;
	this.userPanSpeed = 1.0;
	
	//middle rotate
	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	//right mouse move
	this.userMove = true;
	this.userMoveSpeed = 1.0;

	this.minDistance = 0;
    this.maxDistance = Infinity;

    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	var scope = this;

	var STATE = { NONE: -1, PAN: 0, ROTATE: 1, MOVE: 2 };
    var state = STATE.NONE;

    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var moveStart = new THREE.Vector2();
    var moveEnd = new THREE.Vector2();

    var thetaDelta = 0;


    this.pan = function ( distance ) {

        distance.transformDirection( this.object.matrix );
        distance.multiplyScalar( scope.userPanSpeed );

        this.object.position.add( distance );
        this.center.add( distance );

    };

    this.rotateLeft = function ( angle ) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        thetaDelta -= angle;

    };

    this.rotateRight = function ( angle ) {

        if ( angle === undefined ) {

            angle = getAutoRotationAngle();

        }

        thetaDelta += angle;

    };

    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

    }

    this.update = function (){
    	var position = this.object.position;
    	var offset = position.clone().sub(this.center);

    	// angle from z-axis around y-axis
        var theta = Math.atan2( offset.x, offset.z );

        // angle from y-axis
        var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

        theta += thetaDelta;

        var radius = offset.length();

        // restrict radius to be between desired limits
        radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

        offset.x = radius * Math.sin( phi ) * Math.sin( theta );
        offset.y = radius * Math.cos( phi );
        offset.z = radius * Math.sin( phi ) * Math.cos( theta );

        position.copy( this.center ).add( offset );

        this.object.lookAt( this.center );

        thetaDelta = 0;

    }

	function onMouseDown(event){

		if(scope.enabled === false) return;

		event.preventDefault();

		if(event.button === 0){

			state = STATE.PAN;
		}
		else if(event.button === 1){

			state = STATE.ROTATE;

			rotateStart.set(event.clientX, event.clientY);
		}
		else if(event.button === 2){

			state = STATE.MOVE;

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
	}

	function onMouseMove(event){
		if(scope.enabled === false) return;

		event.preventDefault();

		if(state === STATE.PAN){
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );
		}
		else if(state === STATE.ROTATE){

		}
		else if(state === STATE.MOVE){

		}

	}

	function onMouseUp(event){

		if ( scope.enabled === false ) return;

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        state = STATE.NONE;
	}

	function onMouseWheel(event){
		if ( scope.enabled === false ) return;
        if ( scope.userRotate === false ) return;

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail;

        }


        scope.rotateLeft(delta / 1000 * scope.userRotateSpeed);

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    // this.domElement.addEventListener( 'keydown', onKeyDown, false );

}