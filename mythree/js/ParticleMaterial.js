
//record several kinds of particle materials

// from THREE.js examples
function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

}

function getBluePointMaterial(size){
	return new THREE.PointCloudMaterial({
			color: 0xffffff,
			size: 3,
			transparent: true,
			blending: THREE.AdditiveBlending,
			map: generateSprite()
		});
}

