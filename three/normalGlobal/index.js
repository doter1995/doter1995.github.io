window.onload = function () {
    const nomel = './img/earth.jpg'
    const noCloudsImage = './img/2_no_clouds_4k.jpg'
    const bumpImage = './img/elev_bump_4k.jpg'
    const fairCloudsImage = './img/fair_clouds_4k.png'
    const galaxyImage = './img/galaxy_starfield.png'
    const waterImage = './img/water_4k.png'
    //一带一路坐标点
    const MapPoints =
        [
            {
                name: '西安',
                type: 'point',
                position: [108.9797830581, 34.2571543701],
                info: '西安，古称长安、镐京，陕西省省会、副省级市、国家区域(西北)中心城市'
            },
            {
                name: '兰州',
                position: [103.8317604990, 36.0616639885]
            },
            {
                name: '乌鲁木齐',
                position: [87.6139941296, 43.8243846100]
            },
            {
                name: '霍尔果斯',
                position: [80.4083497235, 44.2127789999]

            },
            {
                name: '阿拉木图',
                position: [76.8512485000, 43.2220146000]
            },
            {
                name: '比什凯克',
                position: [74.5697617000, 42.8746212000]
            },
            {
                name: '撒马尔罕',
                position: [66.9749731000, 39.6270120000]

            },
            {
                name: '德黑兰',
                position: [51.3889736000, 35.6891975000]
            },
            {
                name: '伊斯坦布尔',
                position: [28.9783589000, 41.0082376000]
            },
            {
                name: '莫斯科',
                position: [37.6173000000, 55.7558260000]
            },
            {
                name: '杜伊斯堡',
                position: [6.7623293000, 51.4344079000]
            }

        ]
    const MapPoints2 = [
        {
            name: '福州',
            position: [26.0772956987, 119.2916801622]
        },
        {
            name: '泉州',
            position: [24.8768083854, 118.6713291593]
        },
        {
            name: '广州',
            position: [23.1317346641, 113.2590285241]
        },
        {
            name: '海口',
            position: [20.0463929412, 110.1955780220]
        },
        {
            name: '北海',
            position: [21.0277540164, 110.3320763714]
        },
        {
            name: '河内',
            position: [21.0277644000, 105.8341598000]
        },
        {
            name: '吉隆坡',
            position: [3.1390030000, 101.6868550000]
        },
        {
            name: '雅加达',
            position: [-6.1744651000, 106.8227450000]
        },
        {
            name: '加尔各答',
            position: [22.5726460000, 88.3638950000]
        },
        {
            name: '科伦坡',
            position: [6.9270786000, 79.8612430000]
        },
        {
            name: '内罗毕',
            position: [-1.2920659000, 36.8219462000]
        },
        {
            name: '雅典',
            position: [37.9838096000, 23.7275388000]
        },
        {
            name: '威尼斯',
            position: [45.4408474000, 12.3155151000]
        },
        {
            name: '鹿特丹',
            position: [51.9244201000, 4.4777325000]
        }
    ]

    console.log("this three verion:", THREE.REVISION)

    const R = 200;
    var radius = 200.1
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
    console.log("scene.postion", scene.position)
    camera.lookAt(scene.position);
    //设定相机位置,从而实现面向屏幕
    //这个点的采取(个人),在render中打印相机位置，然后鼠标拖动，使地球在正确视角
    camera.position.set(306.400, 236.61, -100.65);
    // camera.position.set(400, 0, 0);
    scene.add(camera);

    //添加地球仪
    var groupSphere = new THREE.Group();

    var sphere = new THREE.Mesh(
        //new THREE.SphereGeometry(radius, segments, segments),
        new THREE.SphereGeometry(R, 50, 50),
        new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(noCloudsImage),
            bumpMap: new THREE.TextureLoader().load(bumpImage),
            bumpScale: 0.001,
            specularMap: new THREE.TextureLoader().load(waterImage),
            specular: new THREE.Color('grey')
        })
    );
    sphere.rotation.y += Math.PI * 3 / 2;//旋转地图，用于对应tranPoint方法
    groupSphere.add(sphere);
    scene.add(groupSphere);

    //加载一个提示红球
    var group = new THREE.Group();
    groupSphere.add(group);
    var tipSphereGeo = new THREE.SphereGeometry(2, 40, 40);
    var tipSphereMater = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var curve = [];
    MapPoints.map((item, i) => {
        var tipSphere = new THREE.Mesh(tipSphereGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        var p = tranPoint(item.position, R);
        tipSphere.position.set(p.x,p.y,p.z);// todo
        tipSphere.name = item.name;
        curve.push(new THREE.Vector2(item.position[0], item.position[1]));
        groupSphere.add(tipSphere);
    })
    if (curve.length > 1) {
        var CatmullCurrce = new THREE.SplineCurve(curve);
        var geometry = new THREE.Geometry();
        CatmullCurrce.getPoints(200).map((item, i) => {
            var point = tranPoint([item.x, item.y], R);
            geometry.vertices.push(tranPoint([item.x, item.y], R));
        })
        var material = new THREE.LineBasicMaterial({ color: 0xFFFF00, linewidth: 1 });
        var curveObject = new THREE.Line(geometry, material);
        groupSphere.add(curveObject);
    }
    //地理坐标转化为3维坐标
    function tranPoint(point, R) {
        const Lat = point[1] * Math.PI / 180;
        const Lon = point[0] * Math.PI / 180;
        var p =new THREE.Vector3(
            Math.sin(Lon) * Math.cos(Lat) * R,
            Math.sin(Lat) * R,
            Math.cos(Lon) * Math.cos(Lat) * R
        )
        return p;
    }
    //加载全球国家分布
    var loader = new THREE.FileLoader();

    //load a text file a output the result to the console
    loader.load(
        './world.json',
        function (resultData) {
            var dataSet = JSON.parse(resultData)
            console.log('下载完成')
            groupSphere.add(graticule = wireframe(graticule10(),200, new THREE.LineBasicMaterial({ color: 0xcccccc })));
            groupSphere.add(mesh = wireframe(topojson.mesh(dataSet),200.5, new THREE.LineBasicMaterial({ color: 0x333333 })));
        },
        // Function called when download progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Function called when download errors
        function (xhr) {
            console.error('An error happened');
        }
    );
    // Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
    function wireframe(multilinestring,radius, material) {
        var geometry = new THREE.Geometry;
        multilinestring.coordinates.forEach(function (line) {
            d3.pairs(line.map(function (d){return tranPoint(d,radius)}), function (a, b) {
                geometry.vertices.push(a, b);
            });
        });
        return new THREE.LineSegments(geometry, material);
    }
    // See https://github.com/d3/d3-geo/issues/95
    function graticule10() {
        var epsilon = 1e-6,
            x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 10, dy = 10,
            X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360,
            x = graticuleX(y0, y1, 2.5), y = graticuleY(x0, x1, 2.5),
            X = graticuleX(Y0, Y1, 2.5), Y = graticuleY(X0, X1, 2.5);

        function graticuleX(y0, y1, dy) {
            var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
            return function (x) { return y.map(function (y) { return [x, y]; }); };
        }

        function graticuleY(x0, x1, dx) {
            var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
            return function (y) { return x.map(function (x) { return [x, y]; }); };
        }

        return {
            type: "MultiLineString",
            coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
                .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
                .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function (x) { return Math.abs(x % DX) > epsilon; }).map(x))
                .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function (y) { return Math.abs(y % DY) > epsilon; }).map(y))
        };
    }
    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    // orbitControl.enableZoom = false;
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        groupSphere.rotation.y += 0.001
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

    }
    animate();
}