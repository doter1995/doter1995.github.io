var BgScene = function (config) {
    var node = config.node ? config.node : document
    var width = config.width ? config.width : 1000
    var height = config.height ? config.height : 200
    var camera, scene, group, renderer
    var light
    var line
    var scale = new THREE.Vector3(1,1,1);

    function initCube(){
        var box = new THREE.BoxGeometry(20,20,20,3,3,3);
        var tween = new TWEEN.Tween(scale)
	        .to({x:100,y:100,z:100}, 10000)
	        .start();
        var edges = new THREE.EdgesGeometry( box );
        var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
        // group.add(new THREE.Mesh(box,new THREE.MeshBasicMaterial({color:0x000000})))
        group.add( line );
        scene.add(group);
    }


    function initLight() {
        light = new THREE.HemisphereLight('#ffffff', '#ffffff', 1.5);
        light.position.set(0, 800, 0);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(60, width / height, 1, 2100);
        camera.position.set(0, 0, 400)
        camera.lookAt(0, 0, 0)
    }

    function init() {
        //创建场景
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        //创建场景
        scene = new THREE.Scene()
        scene.background = new THREE.Color( '#00C0F1' )
        //创建相机，灯光
        group = new THREE.Group();

        initCamera()
        initLight()
        initCube()

        node.appendChild(renderer.domElement)
        var orbitControl = new THREE.OrbitControls(camera);
        animate();
    }

    function animate() {
        TWEEN.update();
        group.scale.set(10,10,10)
        group.rotation.y+=0.01
        requestAnimationFrame(animate);
        renderer.setSize(width, height)
    renderer.render(scene, camera)

    }
    init();
    

}