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
    camera.position.set(100, 0, 0)
    camera.lookAt(scene.position)
    var axisHelper = new THREE.AxisHelper(1000)
    scene.add(axisHelper);
    // 添加分组
    var group = new THREE.Group();
    scene.add(group);

    //计算参数，这些参数在多处用到
    var segmentHeight = 8;//节高
    var segmentCount = 4;////节数
    var height = segmentHeight * segmentCount;
    var halfHeight = height * 0.5;

    var sizing = {
        segmentHeight: segmentHeight,
        segmentCount: segmentCount,
        height: height,
        halfHeight: halfHeight
    };
    //创建骨骼
    bones = [];
    var prevBone = new THREE.Bone();
    bones.push(prevBone);
    prevBone.position.y = - sizing.halfHeight;
    for (var i = 0; i < sizing.segmentCount; i++) {
        var bone = new THREE.Bone();
        bone.position.y = sizing.segmentHeight;
        bones.push(bone);
        prevBone.add(bone);
        prevBone = bone;
    }
    //创建形状
    var skeleton = new THREE.Skeleton(bones);
    var cylinderGeometry = new THREE.CylinderGeometry(
        5,                       // radiusTop
        5,                       // radiusBottom
        sizing.height,           // height
        8,                       // radiusSegments
        sizing.segmentCount * 3, // heightSegments
        false                     // openEnded
    )
    var material = new THREE.MeshPhongMaterial({
        skinning: true,
        color: 0x156289,
        emissive: 0xa72534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        wireframe: true
    });
    //构建骨骼与网格的关联关系
    for (var i = 0; i < cylinderGeometry.vertices.length; i++) {
        var vertice = cylinderGeometry.vertices[i];
        var y = (vertice.y + sizing.halfHeight);
        var skinIndex = Math.floor(y / sizing.segmentHeight);
        var skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;
        cylinderGeometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
        cylinderGeometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
    }

    var cylend = new THREE.SkinnedMesh(cylinderGeometry, material)


    cylend.add(bones[0]);
    cylend.bind(skeleton);
    scene.add(cylend);
    var helper = new THREE.SkeletonHelper(cylend);
    helper.material.linewidth = 1000;
    scene.add(helper);
    scene.add(cylend);
    //添加一个控制器
    var angle=0;
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        angle += 0.1;
        angle = angle%60;
        cylend.skeleton.bones[ 3 ].rotation.z  = angle/Math.PI;
        cylend.skeleton.bones[ 2 ].rotation.y  = -angle/Math.PI;
        cylend.skeleton.bones[ 1 ].rotation.z  = -angle/Math.PI;
        helper.update();



        requestAnimationFrame(animate);
        stats.update();
        renderer.render(scene, camera);
    }
    animate();
}