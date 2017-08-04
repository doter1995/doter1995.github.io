// import THREE from 'three'
window.onload = function () {
    console.log("this three verion:", THREE.REVISION)
    const R = 200;
    var three = {
        W: window.innerWidth,
        H: window.innerHeight,
        Root: document.getElementById('root'),
    }
    var renderer = new THREE.WebGLRenderer({ antialias: true })
    //建议设置大小，否则会出现锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    three.Root.appendChild(renderer.domElement)
    //创建场景
    var scene = new THREE.Scene();
    var amblight = new THREE.AmbientLight(0xffffff);
    var light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(amblight);
    light.position.set(0, 150, 0);
    scene.add(light);
    var axisHelper = new THREE.AxisHelper(800);
    scene.add(axisHelper);

    var camera = new THREE.PerspectiveCamera(60, three.W / three.H, 0.1, 200000);
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