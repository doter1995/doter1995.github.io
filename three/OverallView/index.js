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
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = "320px";
    stats.domElement.style.top = "10px";
    Root.Root.appendChild(stats.dom);
    console.log(stats)
    //创建场景
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 1, 1100);
    camera.position.set(0, 0, 1)
    camera.lookAt(0, 0, 0)
    // var axisHelper = new THREE.AxisHelper(1000)
    // scene.add(axisHelper);
    // 添加分组
    // 球形不适合，原因是球形会使图像场景部分弯曲
    // var groupSphere = new THREE.Group();
    // groupSphere.position.setY(80);
    // //尝试球形
    //  var sphere = new THREE.Mesh(
    //     //new THREE.SphereGeometry(radius, segments, segments),
    //     new THREE.SphereGeometry(150, 50, 50),
    //     new THREE.MeshBasicMaterial({
    //         side:THREE.BackSide,
    //         map: new THREE.TextureLoader().load('./img/overView.jpg'),
    //        })
    // );
    // groupSphere.add(sphere);
    // scene.add(groupSphere);

    //尝试六面体正方体
    var meshGroup = new THREE.Group();
    scene.add(meshGroup);

    function getMateriales() {
        var materiales = ['']
        var imgs = ['img.right','img.left','img.top','img.bottom','img.front', 'img.back', ]
        for (var i = 0; i < imgs.length; i++) {
            materiales[i] = new THREE.MeshBasicMaterial({
                side: THREE.BackSide,
                map: new THREE.TextureLoader().load('img/' + imgs[i] + '.jpg')
            })
            console.log(i)
        }
        return materiales
    }

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        getMateriales()
    )

    meshGroup.add(mesh);

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