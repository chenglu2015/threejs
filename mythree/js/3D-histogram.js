
THREE.Histogram = function (width, camera, scene){
	
	this.scene = scene;
	this.camera = camera;
	
	this.width = width;

	var maxnum = 0;
	var scope = this;

	var histograms = [];
	var speed = 1;
	var distance = new THREE.Vector3(0, 0, 0);
	var count = 0;
	var hlen = 0;
	var status = 0, process = 0, YSIGN = true;

	var xArray = [];
	var zArray = [];
	var textArray = [];  //text meshes;

	var options = {
        size: 1,
        height: 0.1,
        weight: 'normal',
        font: 'helvetiker',
        bevelThickness: 2,
        bevelSize: 4,
        bevelSegments: 3,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
    };

    var mtl = new THREE.MeshLambertMaterial({
    	color: 0x000000,
    	visible: false
    });

	this.addData = function( data ){

		for(var index in data){
			var x = data[index].x;
			var z = data[index].z;

			if(xArray.indexOf(x) < 0){
				xArray.push(x);
				histograms.push([]);
			}
			if(zArray.indexOf(z) < 0){
				zArray.push(z);
			}

			var xIndex = xArray.indexOf(x);
			var zIndex = zArray.indexOf(z);
			histograms[xIndex][zIndex] = {};
			var histogram = histograms[xIndex][zIndex];

			var num = data[index].num;
			maxnum = Math.max(maxnum, num, scope.width * xIndex, scope.width * zIndex);

			// histogram.distanceX = scope.width * xIndex;
			// histogram.distanceZ = scope.width * zIndex;

			var position = new THREE.Vector3(scope.width * (xIndex + 1 / 2), num / 2, scope.width * (zIndex + 1 / 2));
			histogram.position = position;

		}

		for(var i = 0; i < histograms.length; i++){
			for(var j = 0; j < histograms[i].length; j++){
				var histogram = histograms[i][j];
				
				//movement of x&z
				var movement = new THREE.Vector3();
				movement.x = scope.width * i;
				movement.z = scope.width * j;
				movement.y = 0;
				histogram.movement = movement;
				
				//movement of y
				if(i == 0){
					histogram.moveToZ = 0;
				}
				else{
					var last = histograms[i - 1][j];
					histogram.moveToZ = last.position.y * 2 + last.moveToZ;
				}
				if(j == 0){
					histogram.moveToX = 0;
				}
				else{
					var last = histograms[i][j - 1];
					histogram.moveToX = last.position.y * 2 + last.moveToX;
				}
				
				var delta = new THREE.Vector3(0, 0, 0);
				histogram.delta = delta;
				hlen ++;
			}
		}
	}

	this.draw = function(){

		var axes = new THREE.AxisHelper(maxnum * 1.1);
 		scope.scene.add(axes);

 		var len = histograms.length;

 		for(var index in xArray){

 			var geom = new THREE.TextGeometry(xArray[index], options);
			var text = new THREE.Mesh(geom, mtl);
 			text.position.x = scope.width * index + scope.width;
 			text.position.y = 0;
 			text.position.z = -3;
 			text.rotation.y = Math.PI;
 			textArray.push(text);
 			scope.scene.add(text);
 		}

 		for(var index in zArray){
 			var geom = new THREE.TextGeometry(zArray[index], options);
			var text = new THREE.Mesh(geom, mtl);
 			text.position.x = -3;
 			text.position.y = 0;
 			text.position.z = scope.width * index;
 			text.rotation.y = - Math.PI / 2;
 			textArray.push(text);
 			scope.scene.add(text);
 		}

 		for(var i in histograms){
 			var len2 = histograms[i].length;
 			for(var j in histograms[i]){
 				var histogram = histograms[i][j];
 				var px = histogram.position.x;
 				var py = histogram.position.y;
 				var pz = histogram.position.z;

 				var geom = new THREE.BoxGeometry(scope.width * 0.8, py * 2, scope.width * 0.8);

 				var color = new THREE.Color();
				color.setHSL( i / len + j / (len * len2), 1.0, 0.5 );
				var material = new THREE.MeshLambertMaterial();
				material.color = color;

				var box = new THREE.Mesh(geom, material);
				box.position.set(px, py, pz);
				histogram.mesh = box;
				scope.scene.add(box);

				// var textGeom = new THREE.TextGeometry((py * 2).toFixed(2), options);
				// var text = new THREE.Mesh(textGeom, mtl);
				// text.position.set(px, py * 2, pz);
				// text.rotation.x = - Math.PI / 2;
				// textArray.push(text);
				// scope.scene.add(text);
 			}
 		}
		
	}

	this.summaryX = function () {
		if(distance.x != 0 || distance.y != 0 || distance.z != 0){
			return false;
		}
		if(status == 1){
			return false;
		}
		else if(status == 2){
			scope.back();
		}
		else if(status == 0){
			YSIGN = false;
			count = 20;
			process = 1;
			distance.y = 1;
			status = 1;
		}
	}

	this.summaryZ = function () {
		if(distance.x != 0 || distance.y != 0 || distance.z != 0){
			return false;
		}
		if(status == 2){
			return false;
		}
		else if(status == 1){
			scope.back();
		}
		else if(status == 0){
			YSIGN = true;
			count = 10;
			process = 3;
			distance.y = 1;
			status = 2;
		}
	}

	this.back = function () {
		if(distance.x != 0 || distance.y != 0 || distance.z != 0){
			return false;
		}
		if(status == 0){
			return false;
		}
		else if(status == 2){
			YSIGN = true;
			count = 10;
			process = 4;
			distance.z = 1;
			status = 0;
		}
		else if(status == 1){
			YSIGN = false;
			count = 20;
			process = 2;
			distance.x = 1;
			status = 0;
		}
	}

	this.setSpeed = function(e){
		speed = e;
	}

	this.showAxis = function(e){
		mtl.visible = e;
	}
	

	this.update = function () {
		// mtl.visible = false;
		
		for(var index in textArray){
			textArray[index].lookAt(scope.camera.position);
		}

		if(distance.y != 0){
			if(YSIGN){
				moveYX();
			}
			else{
				moveYZ();
			}
		}
		if(distance.x != 0){
			moveX();
		}
		if(distance.z != 0){
			moveZ();
		}

		if(count == hlen){
			switch(process){
				case 1:
					distance.y = 0;
					distance.x = -1;
					count = 20;
					break;
				case 2:
					distance.x = 0;
					distance.y = -1;
					count = 20;
					break;
				case 3:
					distance.y = 0;
					distance.z = -1;
					count = 10;
					break;
				case 4:
					distance.z = 0;
					distance.y = -1;
					count = 10;
					break;
				default:
					distance.x = 0;
					distance.y = 0;
					distance.z = 0;
					count = 0;
			}
			
			process = 0;

			for(var i = 0; i < histograms.length; i++){
				for(var j = 0; j < histograms[i].length; j++){
					var histogram = histograms[i][j];
					histogram.delta = new THREE.Vector3(0, 0, 0);
				}
			}
		}


	}

	function getDistance(distance) {
		if(distance > 0){

		}

	}

	function moveX() {
		for(var i = 0; i < histograms.length; i++){
			for(var j = 0; j < histograms[i].length; j++){
				var histogram = histograms[i][j];
				if(histogram.movement.x == histogram.delta.x){
					continue;
				}
				else if(histogram.movement.x - histogram.delta.x < speed){
					histogram.mesh.position.x += (histogram.movement.x - histogram.delta.x) * distance.x;
					histogram.delta.x = histogram.movement.x;
				}
				else{
					histogram.delta.x += speed;
					histogram.mesh.position.x += speed * distance.x;
				}
				if(histogram.movement.x == histogram.delta.x){
					count ++;
				}
			}
		}
	}

	function moveYX() {
		for(var i = 0; i < histograms.length; i++){
			for(var j = 0; j < histograms[i].length; j++){
				var histogram = histograms[i][j];
				if(histogram.moveToX == histogram.delta.y){
					continue;
				}
				else if(histogram.moveToX - histogram.delta.y < speed){
					histogram.mesh.position.y += (histogram.moveToX - histogram.delta.y) * distance.y;
					histogram.delta.y = histogram.moveToX;
				}
				else{
					histogram.delta.y += speed;
					histogram.mesh.position.y += speed * distance.y;
				}
				if(histogram.moveToX == histogram.delta.y){
					count ++;
				}
			}
		}
	}

	function moveYZ() {
		for(var i = 0; i < histograms.length; i++){
			for(var j = 0; j < histograms[i].length; j++){
				var histogram = histograms[i][j];
				if(histogram.moveToZ == histogram.delta.y){
					continue;
				}
				else if(histogram.moveToZ - histogram.delta.y < speed){
					histogram.mesh.position.y += (histogram.moveToZ - histogram.delta.y) * distance.y;
					histogram.delta.y = histogram.moveToZ;
				}
				else{
					histogram.delta.y += speed;
					histogram.mesh.position.y += speed * distance.y;
				}
				if(histogram.moveToZ == histogram.delta.y){
					count ++;
				}
			}
		}
	}

	function moveZ() {
		for(var i = 0; i < histograms.length; i++){
			for(var j = 0; j < histograms[i].length; j++){
				var histogram = histograms[i][j];
				if(histogram.movement.z == histogram.delta.z){
					continue;
				}
				else if(histogram.movement.z - histogram.delta.z < speed){
					histogram.mesh.position.z += (histogram.movement.z - histogram.delta.z) * distance.z;
					histogram.delta.z = histogram.movement.z;
				}
				else{
					histogram.delta.z += speed;
					histogram.mesh.position.z += speed * distance.z;
				}
				if(histogram.movement.z == histogram.delta.z){
					count ++;
				}
			}
		}
	}


}