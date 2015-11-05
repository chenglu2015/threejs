

THREE.Interaction = function (line, scene) {

	this.line = line;
	this.scene = scene;

	this.k = 10;

	var originLen = getOriginLength();

	var scope = this;
	var v = new THREE.Vector3(0, 0, 0);
	var a = new THREE.Vector3(0, 0, 0);

	this.update = function(){
		line.geometry.verticesNeedUpdate = true;


	}

	function getOriginLength(){
		var v1 = line.geometry.vertices[0].clone();
		var v2 = line.geometry.vertices[1].clone();

		return v1.sub(v2).length();
	}

}