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
    var stats = new Stats();
    console.log(stats)
    stats.domElement.style.position='absolute';
    stats.domElement.style.left="320px";
    stats.domElement.style.top="10px";
      Root.Root.appendChild(stats.dom);
     console.log(stats)
    //创建场景
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
  
    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 1, 1100);
    camera.position.set(0, 0,1000)
    camera.lookAt(scene.position)
    var axisHelper = new THREE.AxisHelper(1000)
    scene.add(axisHelper);
    // 添加分组
    var group = new THREE.Group();
    scene.add(group);

    var lineGeometry = new THREE.Geometry();
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 110));
    lineGeometry.vertices.push(new THREE.Vector3(0, 110, 0));
    lineGeometry.vertices.push(new THREE.Vector3(110, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 110));
    var line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);

    //加载字体
    var loader = new THREE.FontLoader();
    var font = loader.load(
        // resource URL
        '../fonts/helvetiker_regular.typeface.json',
        function (font) {
            // do something with the font
            var textGeometry = new THREE.TextGeometry('DOTER1995', {
                font: font,
                size: 60,
                height: 5,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            })
            var textMaterial = new THREE.LineBasicMaterial({ color: '#c63' })
            var mesh = new THREE.Mesh(textGeometry, textMaterial)
            mesh.position.set(-300, 0, 0);
            group.add(mesh);
        }
    );

    var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    var edges = new THREE.EdgesGeometry(geometry);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(line);

    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        requestAnimationFrame(animate);
        stats.update();
        renderer.render(scene, camera);
    }
    animate();
}