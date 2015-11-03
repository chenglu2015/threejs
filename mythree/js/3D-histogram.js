
THREE.Histogram = function (width, scene){
	this.scene = scene;
	this.xArray = [];
	this.zArray = [];
	this.geomArray = [];
	this.boxArray = [];
	this.width = width;

	var maxnum = 0;
	var scope = this;

	this.options = {
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

    this.mtl = new THREE.MeshLambertMaterial({color:0x000000});

	this.addData = function( data ){

		for(var index in data){
			var x = data[index].x;
			var z = data[index].z;

			if(scope.xArray.indexOf(x) < 0){
				scope.xArray.push(x);
			}
			if(scope.zArray.indexOf(z) < 0){
				scope.zArray.push(z);
			}

			var xIndex = scope.xArray.indexOf(x);
			var zIndex = scope.zArray.indexOf(z);
			var num = data[index].num;
			
			maxnum = Math.max(maxnum, num, scope.width * xIndex, scope.width * zIndex);

			var geom = new THREE.Vector3(scope.width * (xIndex + 1 / 2), num / 2, scope.width * (zIndex + 1 / 2));
			scope.geomArray.push(geom);
		}
	}

	this.draw = function(){

		var axes = new THREE.AxisHelper(maxnum * 1.1);
 		scope.scene.add(axes);

 		var len = scope.geomArray.length;
 		var xlen = scope.xArray.length;
 		var zlen = scope.zArray.length;

 		for(var index in scope.xArray){

 			var geom = new THREE.TextGeometry(scope.xArray[index], scope.options);
			var text = new THREE.Mesh(geom, scope.mtl);
 			text.position.x = scope.width * index + scope.width;
 			text.position.y = 0;
 			text.position.z = -1;
 			text.rotation.y = Math.PI;
 			scope.scene.add(text);
 		}

 		for(var index in scope.zArray){
 			var geom = new THREE.TextGeometry(scope.zArray[index], scope.options);
			var text = new THREE.Mesh(geom, scope.mtl);
 			text.position.x = -1;
 			text.position.y = 0;
 			text.position.z = scope.width * index;
 			text.rotation.y = - Math.PI / 2;
 			scope.scene.add(text);
 		}
		
		for(var index in scope.geomArray){
			var px = scope.geomArray[index].x;
			var py = scope.geomArray[index].y;
			var pz = scope.geomArray[index].z;

			var geom = new THREE.BoxGeometry(scope.width * 0.9, py * 2, scope.width * 0.9);

			var color = new THREE.Color();
			color.setHSL( index / len, 1.0, 0.5 );
			var mtl = new THREE.MeshLambertMaterial();
			mtl.color = color;

			var box = new THREE.Mesh(geom, mtl);
			box.position.set(px, py, pz);
			scope.boxArray.push(box);
			scope.scene.add(box);

			var textGeom = new THREE.TextGeometry((py * 2).toFixed(2), scope.options);
			var text = new THREE.Mesh(textGeom, scope.mtl);
			text.position.set(px - scope.width / 2, py * 2, pz);
			text.rotation.x = - Math.PI / 2;
			scope.scene.add(text);

		}
	}


}