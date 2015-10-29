
//the point position's calculation for bezier surface with given points  

//n > i >= 0, i, n is an integer
function C(i, n){
	var maxp = 1, minp = 1;
	for(var t = 1; t <= n; t++){
		if(t <= i){
			minp *= t;
		}
		if(t > n - i){
			maxp *= t;
		}
	}
	return maxp / minp;
}

//n > i >= 0, i, n is an integer, 1 >= t >= 0
function B(i, n, t){
	return C(i, n) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

//p is the given points
function getBezierSurfacePoint(u, v, m, n, p){
	var result = new THREE.Vector3(0, 0, 0);
	for(var i = 0; i <= m; i++){
		for(var j = 0; j <= n; j++){
			var x = p[i][j].x * B(j, n, v) * B(i, m, u);
			var y = p[i][j].y * B(j, n, v) * B(i, m, u);
			var z = p[i][j].z * B(j, n, v) * B(i, m, u);
			result.add(new THREE.Vector3(x, y, z));
		}
	}

	return result;
}