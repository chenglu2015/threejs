
THREE.MoveEffect = function ( points, linkpoints, domElement ) {
	
	this.points = points;
	this.linkpoints = linkpoints;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.v = [];

	this.originForce = [];

	this.movement;
	this.INTERSECTED = -1;

	var scope = this;
	var except = [];

	this.move = function ( e, f ) {
		scope.points[e].position.add(f);
		for(var index in linkpoints[e]){
			var i = linkpoints[e][index];

			if(except.indexOf(i) > -1){
				continue;
			}

			var f1 = f.clone();
			var f2 = new THREE.Vector3(0, 0, 0);
			f2.subVectors(scope.points[e], scope.points[i]);

			var scale = (f1.x * f2.x + f1.y * f2.y + f1.z * f2.z) / (f2.x * f2.x + f2.y * f2.y + f2.z * f2.z);
			var fn = f2.clone().multiplyScalar(scale);

			except.push(e);
			
			scope.move(i, fn);
		}
	}

	this.update = function () {
		except = [];
	}

	function onMouseDown( event ){

		if(scope.INTERSECTED < 0){
			return false;
		}

		event.preventDefault();

		document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
	}

	function onMouseMove( event ){

		event.preventDefault();

		moveX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        moveY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        scope.originForce = new THREE.Vector3(moveX, moveY, 0);
        console.log(scope.originForce);
        scope.move(scope.INTERSECTED, scope.originForce);
        scope.update();
	}

	function onMouseUp(event){

		if ( scope.enabled === false ) return;

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );

}