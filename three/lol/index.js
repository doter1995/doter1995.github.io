// import THREE from 'three'
window.onload = function () {
    console.log("this Root verion:", THREE.REVISION)
    const R = 200;
    var Root = {
        W: window.innerWidth,
        H: window.innerHeight,
        Root: document.getElementById('root'),
    }
    var renderer = new THREE.WebGLRenderer({ antialias: true })
    //建议设置大小，否则会出现锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    Root.Root.appendChild(renderer.domElement)
    //创建场景
    var scene = new THREE.Scene();
    //设置场景背景色
    scene.background= new THREE.Color(0x333333);
    //添加雾化效果
    scene.fog = new THREE.Fog('#666', 15000, 20000)
    var amblight = new THREE.AmbientLight(0xffffff, 1.5);
      
    scene.add(amblight);
    var light = new THREE.DirectionalLight('#FFF', 1);
    light.position.set(0, -7000, 0);
    var helper = new THREE.DirectionalLightHelper( light, 10000 );
    scene.add(helper)
    scene.add(light);
    var axisHelper = new THREE.AxisHelper(800);
    scene.add(axisHelper);

    var geometry = new THREE.Geometry(),
				pickingGeometry = new THREE.Geometry(),
				pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } ),
				defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0	} );

    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 0.1, 200000);
    camera.position.set(0, 0, 15000);
    // camera.position.set(-117.5,191.6,-290.7);
    camera.lookAt(scene.position);
    scene.add(camera);
    var group = new THREE.Group();
    scene.add(group);

    //添加地球仪
    var groupSphere = new THREE.Group();

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/a.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./models/a.obj', function (object) {
            object.position.set(0, 0, 0);
            scene.add(object);
        });
    });



    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}