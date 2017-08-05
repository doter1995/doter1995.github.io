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
    var stats= new Stats();
    //创建场景
    var scene = new THREE.Scene();
    scene.background= new THREE.Color(0xffffff);
    Root.Root.appendChild(stats.dom);
    var camera = new THREE.PerspectiveCamera(60,Root.W/Root.H,10000);
    camera.position.setZ(600);
    camera.lookAt(scene.position)

    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(scene);
        //重复渲染
        requestAnimationFrame(animate);
        stats.update();
        renderer.render(scene, camera);
    }
    animate();
}