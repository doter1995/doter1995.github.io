window.onload = function () {
    const nomel = './img/earth.jpg'
    const noCloudsImage = './img/2_no_clouds_4k.jpg'
    const bumpImage = './img/elev_bump_4k.jpg'
    const fairCloudsImage = './img/fair_clouds_4k.png'
    const galaxyImage = './img/galaxy_starfield.png'
    const waterImage = './img/water_4k.png'

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
    //创建光源
    var light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
    light.position.set(0, 800, 0);
    scene.add(light);
    //辅助线
    // var axisHelper = new THREE.AxisHelper(800);
    // scene.add(axisHelper);
    //创建相机
    var camera = new THREE.PerspectiveCamera(75, three.W / three.H, 0.1, 2000);
    //未设置场景的位置 所以默认为 0 0 0
    console.log("scene.postion",scene.position)
    camera.lookAt(scene.position);

    camera.position.set(-58,222,-272);
    scene.add(camera);

    //添加地球仪
    var groupSphere = new THREE.Group();

    var sphere = new THREE.Mesh(
        //new THREE.SphereGeometry(radius, segments, segments),
        new THREE.SphereGeometry(200, 50, 50),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(noCloudsImage),
            bumpMap: new THREE.TextureLoader().load(bumpImage),
            bumpScale: 0.1,
            specularMap: new THREE.TextureLoader().load(waterImage),
            specular: new THREE.Color('grey')
        })
    );
    groupSphere.add(sphere)
    //添加云层
    var colundSphere = new THREE.Mesh(
        //new THREE.SphereGeometry(radius, segments, segments),
        new THREE.SphereGeometry(202, 55, 55),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(fairCloudsImage),
        })
    );
    colundSphere.material.transparent=true
    //添加星空
    var starsSphere = new THREE.Mesh(
        //new THREE.SphereGeometry(radius, segments, segments),
        new THREE.SphereGeometry(400, 55, 55),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(galaxyImage),
            side:THREE.BackSide,
        })
    );


   
    groupSphere.add(colundSphere);
    groupSphere.add(starsSphere);
    scene.add(groupSphere);
    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        console.log(camera.position);
        colundSphere.rotation.y+=0.001
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        requestAnimationFrame(animate);
        console.log("camera.position",camera.position)
        renderer.render(scene, camera);
    }
    animate();
}