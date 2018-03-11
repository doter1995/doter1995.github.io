var BgScene = function (config) {
    var node = config.node ? config.node : document
    var width = config.width ? config.width : 1000
    var height = config.height ? config.height : 200
    var camera, scene, group, renderer
    var light
    var line
    var Sp_Max = 50000;
    var particles = new THREE.Group()
    var scale = new THREE.Vector3(1, 1, 1);
    //构建星空背景
    function initGlobal() {
        var global = new THREE.SphereGeometry(1000, 30, 30);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./img/galaxy_starfield.png'),
            side: THREE.DoubleSide
        })
        scene.add(new THREE.Mesh(global, material))
    }
    // 构建粒子星空
    function initPaeticles() {

        var spriteMaterial, vertex;
        for (var i = -1000; i < Sp_Max; i += 20) {
            var x = (Math.random() * 6).toFixed(0)
            var color = x < 1 ? '#F25B20' : x > 5 ? '#F7DE1F' : '#4391F5'
            var spriteMaterial = new THREE.SpriteMaterial({
                color: color
            })
            vertex = new THREE.Sprite(spriteMaterial)
            vertex.position.x = Math.random() * 1000 - (1000 * .5);
            vertex.position.y = (Math.random() * 1000) - (1000 * .5);
            vertex.position.z = Math.random() * 1000 - (1000 * .5);
            particles.add(vertex)
        }
        scene.add(particles)
    }
    //创建地球
    function initEarth() {
        var earth = new THREE.Mesh(
            new THREE.SphereGeometry(30, 30, 30),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./img/2_no_clouds_4k.jpg')
            })
        )
        earth.position.set(0,0,200)
        scene.add(earth)
        var earth = new THREE.Mesh(
            new THREE.SphereGeometry(31, 30, 30),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./img/fair_clouds_4k.png'),
                transparent:true
            })
        )
        earth.position.set(0,0,200)
        scene.add(earth)

    }
    //创建火星
    function initHuoXing(){
        var huoxing = new THREE.Mesh(
            new THREE.SphereGeometry(30, 50, 50),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./img/huoxing.jpg')
            })
        )
        huoxing.position.set(0,0,400)
        scene.add(huoxing)
    }
     //创建太阳
     function initSun(){
        var sun = new THREE.Mesh(
            new THREE.SphereGeometry(100, 50, 50),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./img/huoxing.jpg')
            })
        )
        sun.position.set(0,0,0)
        scene.add(sun)
    }

    function initCube() {
        var box = new THREE.BoxGeometry(20, 20, 20, 3, 3, 3);
        var edges = new THREE.EdgesGeometry(box);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: 0x4391F5,
            linewidth: 10,
            linecap: 'square'
        }));
        // group.add(new THREE.Mesh(box,new THREE.MeshBasicMaterial({color:0x000000})))
        group.add(line);
        scene.add(group);
    }

    function initLight() {
        light = new THREE.HemisphereLight('#ffffff', '#ffffff', 1.5);
        light.position.set(0, 800, 0);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(60, width / height, 50, 2100);
        camera.position.set(0, 0, 400)
        camera.lookAt(0, 0, 0)
    }

    function init() {
        //创建场景
        renderer = new THREE.WebGLRenderer({
            antialias: true
        })
        renderer.setSize(width, height)
        //创建场景
        scene = new THREE.Scene()
        //创建相机，灯光
        group = new THREE.Group();

        initCamera()
        initLight()
        initEarth()
        initHuoXing()
        initSun()

        initPaeticles()
        node.appendChild(renderer.domElement)
        var orbitControl = new THREE.OrbitControls(camera);
        animate();
    }

    function animate() {
        TWEEN.update();
        group.scale.set(10, 10, 10)
        group.rotation.y += 0.01
        requestAnimationFrame(animate);
        renderer.setSize(width, height)
        renderer.render(scene, camera)
    }
    init();


}