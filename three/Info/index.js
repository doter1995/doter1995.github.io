// import THREE from 'three'
window.onload = function () {
    console.log("this Root verion:", THREE.REVISION)
    const R = 200;
    var Root = {
        W: window.innerWidth,
        H: window.innerHeight,
        Root: document.getElementById('root'),
    }
    //初始化状态检测
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = "320px";
    stats.domElement.style.top = "10px";



    var renderer = new THREE.WebGLRenderer({ antialias: true })
    //建议设置大小，否则会出现锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    Root.Root.appendChild(renderer.domElement)
    Root.Root.appendChild(stats.dom);

    //创建场景
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 1, 1100);
    camera.position.set(0, 0, 400)
    camera.lookAt(0, 0, 0)
    //添加轴
    function initEarth() {
        //创建一个地球
        var groupSphere = new THREE.Group();
        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(200, 100, 100),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./img/earth.jpg')
            })
        );
        groupSphere.add(sphere);
        //创建星云背景
        var sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(600, 50, 50),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide,
                map: new THREE.TextureLoader().load('./img/galaxy_starfield.png')
            })
        );
        groupSphere.add(sphere1);
        scene.add(groupSphere);

    }
    function initHome(){
        var home =new THREE.Group();
        var HomeGeometry = new THREE.BoxGeometry(150, 150, 150);
        var outMeshMaterial
        var homeMesh = new THREE.Mesh(HomeGeometry, [new THREE.MeshBasicMaterial(
            {
                side: THREE.DoubleSide,
                map: [
                    new THREE.TextureLoader().load('./img/outTop.jpg'),
                    new THREE.TextureLoader().load('./img/outWall.jpg'),
                    new THREE.TextureLoader().load('./img/outWall.jpg'),
                    new THREE.TextureLoader().load('./img/outWall.jpg'),
                    new THREE.TextureLoader().load('./img/outWall.jpg'),
                    new THREE.TextureLoader().load('./img/outWall.jpg')
                ]
            }
        ))
        home.add(homeMesh);
        scene.add(home);
    }

    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    initEarth();
    initHome();
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        requestAnimationFrame(animate);
        stats.update();
        renderer.render(scene, camera);
    }
    animate();
}