

THREE.Interaction = function (points, controls, camera, scene, domElement) {

	this.points = points;
	this.scene = scene;
	this.controls = controls;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	var scope = this;

	var line, plane;
	var originLens = [];
	var lineMaterial = new THREE.LineBasicMaterial({
    	color: 0xffffff,
    	opacity: 1,
    	linewidth: 3,
    	vertexColors: THREE.VertexColors
    });

	//raycaster and intersects
	var raycaster = new THREE.Raycaster();
	var SELECTED, INTERSECTED;
	var offset = new THREE.Vector3();
	var mouse = new THREE.Vector2();  //mouse position

	var moved = [];
	var v = [];
	var a = [];
	var SELECTED_INDEX;
	var k = 0.01;



	this.update = function(){
		for(var i = 0; i < scope.points.length; i++){
			v[i].add(a[i]);
			scope.points[i].position.add(v[i]);
			// console.log(a[i].length());
			// console.log(v[i].length());
			// console.log(scope.points[i].position);
			a[i] = new THREE.Vector3();
		}
		line.geometry.verticesNeedUpdate = true;

		console.log("           ")
		dampV();
		moved = [];

	}

	function dampV(){
		for(var i = 0; i < v.length; i++){
			if(v[i].length() < 5){
				v[i] = new THREE.Vector3();
			}
			else{
				v[i] = v[i].multiplyScalar(0.8);
			}
		}
	}

	function move( index ) {
		var front = index - 1;
		if(moved.indexOf(front) < 0 && front >= 0){
			var v1 = scope.points[front].position.clone();
			var v2 = scope.points[index].position.clone();

			var len = getLength(v1, v2);
			var delta = len - originLens[front];

			a[front] = v2.sub(v1).multiplyScalar(k * delta * delta);
			if(delta < 0){
				a[front].multiplyScalar(-1);
			}

			console.log(delta);
			moved.push(front);
			move(front);
		}

		var behind = index + 1;
		if(moved.indexOf(behind) < 0 && behind < scope.points.length){
			var v1 = scope.points[behind].position.clone();
			var v2 = scope.points[index].position.clone();

			var len = getLength(v1, v2);
			var delta = len - originLens[index];

			a[behind] = v2.sub(v1).multiplyScalar(k * delta * delta);
			if(delta < 0){
				a[behind].multiplyScalar(-1);
			}

			moved.push(behind);
			move(behind);
		}
	}

	this.init = function(){
		for(var i = 0; i < scope.points.length - 1; i++){
			var v1 = scope.points[i].position.clone();
			var v2 = scope.points[i + 1].position.clone();

			originLens.push(v1.sub(v2).length());
		}

		var geom = new THREE.Geometry();
		for(var i = 0; i < scope.points.length; i++){
			v[i] = new THREE.Vector3();
			a[i] = new THREE.Vector3();
        	geom.vertices.push(scope.points[i].position);
		}
        line = new THREE.Line(geom, lineMaterial);
        scene.add(line);

        //add plane
		plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
			new THREE.MeshBasicMaterial( { visible: false } )
		);
		scene.add( plane );
	}

	function getLength(v1, v2){
		return v1.sub(v2).length();
	}

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		//

		raycaster.setFromCamera( mouse, camera );

		if ( SELECTED ) {

			var intersects = raycaster.intersectObject( plane );

			if ( intersects.length > 0 ) {

				SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
				line.geometry.verticesNeedUpdate = true;

				move(SELECTED.index);
				moved.push(SELECTED.index);

			}

			return;

		}

		var intersects = raycaster.intersectObjects( scope.points );

		if ( intersects.length > 0 ) {

			if ( INTERSECTED != intersects[ 0 ].object ) {

				if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

				plane.position.copy( INTERSECTED.position );
				plane.lookAt( camera.position );

			}

		} else {

			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

			INTERSECTED = null;

		}

	}

	function onDocumentMouseDown( event ) {

		event.preventDefault();

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( scope.points );

		if ( intersects.length > 0 ) {

			controls.enabled = false;

			SELECTED = intersects[ 0 ].object;

			var intersects = raycaster.intersectObject( plane );

			if ( intersects.length > 0 ) {

				offset.copy( intersects[ 0 ].point ).sub( plane.position );
				

			}


		}

	}

	function onDocumentMouseUp( event ) {

		event.preventDefault();

		controls.enabled = true;

		if ( INTERSECTED ) {

			plane.position.copy( INTERSECTED.position );

			SELECTED = null;

		}

	}

	this.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	this.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	this.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );


}