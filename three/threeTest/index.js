// import THREE from 'three'
window.onload = function () {
    console.log("this Root verion:", THREE.REVISION)
    const IW = 1000,IH=2000;
    var Root = {
        W: window.innerWidth,
        H: window.innerHeight,
        Root: document.getElementById('root'),
    }
    console.log(new THREE.Projector())
    var renderer = new THREE.WebGLRenderer({ antialias: true })
    var cssRenderer = new THREE.CSS3DRenderer();
    //建议设置大小，否则会出现锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight)
    Root.Root.appendChild(renderer.domElement)
    // Root.Root.appendChild(cssRenderer.domElement)
    //创建场景
    var scene = new THREE.Scene();
    var cssScene = new THREE.Scene();
    var group1 = new THREE.Group();
    scene.add(group1);
    //设置场景背景色
    scene.background = new THREE.Color(0x111111);
    var amblight = new THREE.AmbientLight(0xffffff, 0.7);

    scene.add(amblight);
    var light = new THREE.DirectionalLight('#FFF', 1);
    light.position.set(0, 2000, 0);
    scene.add(light);
    var gridHelper = new THREE.GridHelper( 700, 20, 0x00251e, 0x00251e );
    gridHelper.position.y = -5;
    gridHelper.position.x = -700;
    group1.add( gridHelper );
    var gridHelper1 = new THREE.GridHelper( 700, 20, 0x00251e, 0x00251e );
    gridHelper1.position.x = 700;
    gridHelper1.position.y = -5;
    group1.add( gridHelper1);
    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 0.1, 200000);
    camera.position.set(1500, 1000, 1500);
    // camera.position.set(-117.5,191.6,-290.7);
    camera.lookAt(scene.position);
    //整个场景旋转的组
    
    scene.add(camera);
    //构建三个object对象，用于显示对话框
    var tipObjects = [];
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
    tipObjects.push(new THREE.Object3D())
   
    //添加小汽车
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/car.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./models/car.obj', function (object) {
            object.position.set(0, 0, -1500);
            object.scale.x=100;
            object.scale.y=100;
            object.scale.z=100;
            object.name="car1"
            var object1 = object.clone();
            object1.position.set(+700, 0, 1500);
            group1.add(object);
            group1.add(object1);
        });
    });
     
    //添加公交汽车
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/125/125.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./models/125/125.obj', function (object) {
            object.position.set(200, 0, -1100);
            object.scale.x=50;
            object.scale.y=50;
            object.scale.z=50;
            object.name="car2"
            var object1 = object.clone();
            object1.position.set(1200, 0, 1200);
            group1.add(object);
            group1.add(object1);
        });
    });
    //添加加气桩
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/123/123.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./models/123/123.obj', function (object) {
            object.position.set(900, 0, 1000);
            object.scale.x=50;
            object.scale.y=50;
            object.scale.z=50;
            object.rotateY(0.5*Math.PI)
            object.name="car1"
            var object1 = object.clone();
           
            object1.position.set(0, 0, -1000);
            group1.add(object1);
            group1.add(object);
        });
    });
    //   //添加油罐车
    //   var mtlLoader = new THREE.MTLLoader();
    //   mtlLoader.load('./models/124/124.mtl', function (materials) {
    //       materials.preload();
    //       var objLoader = new THREE.OBJLoader();
    //       objLoader.setMaterials(materials);
    //       objLoader.load('./models/124/124.obj', function (object) {
    //           object.position.set(1000, 0, -300);
    //           object.scale.x=0.4;
    //           object.scale.y=0.4;
    //           object.scale.z=0.3;
    //           object.rotateY(1*Math.PI)
    //           group1.add(object);
    //       });
    //   });

        //添加储气罐
        var guan0 = new THREE.Group()
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('./models/129/129.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./models/129/129.obj', function (object) {
                object.position.set(0, 0, 0);
                object.scale.x=80;
                object.scale.y=80;
                object.scale.z=80;
                var object1=object.clone()
                object1.position.set(0,0,240)
                
                guan0.add(object);
                guan0.add(object1);
                guan0.position.set(-1000,0,-400)
                group1.add(guan0);
            });
        });
        //添加楼
       var mtlLoader = new THREE.MTLLoader();
       mtlLoader.load('./models/128/110.mtl', function (materials) {
           materials.preload();
           var objLoader = new THREE.OBJLoader();
           objLoader.setMaterials(materials);
           objLoader.load('./models/128/110.obj', function (object) {
               console.log("aaaa",object)
               object.scale.x=20;
               object.scale.y=20;
               object.scale.z=20;
               object.position.set(-30,0,450);
               group1.add(object);
           });
       });
        //添加燃气管
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('./models/131/131.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./models/131/131.obj', function (object) {
                object.scale.x=25;
                object.scale.y=25;
                object.scale.z=25;
                object.position.set(-1200,0,400);
                var object1 = object.clone()
                object1.position.x+=300
                group1.add(object1);
                group1.add(object);
            });
        });
         //添加罐
         var mtlLoader = new THREE.MTLLoader();
         mtlLoader.load('./models/130/130.mtl', function (materials) {
             materials.preload();
             var objLoader = new THREE.OBJLoader();
             objLoader.setMaterials(materials);
             objLoader.load('./models/130/130.obj', function (object) {
                 var groupG = new THREE.Group();
                 var group = new THREE.Group();
                 object.scale.x=60;
                 object.scale.y=60;
                 object.scale.z=60;
                 var object1 = object.clone()
                 object1.position.set(-220,0,0);
                 group.add(object);
                 group.add(object1);
                 group.position.set(150,0,-300)
                 groupG.add(group)
                 var groupa = group.clone()
                 groupa.position.z-=100;
                 groupG.add(groupa)
                 var groupG1 = groupG.clone()
                 groupG1.position.set(950,0,750)
                 group1.add(groupG)
                 group1.add(groupG1)
             });
         });
         //添加灰色路带
         var planesG = new THREE.Group()
         var geometry = new THREE.PlaneGeometry( 300, 1000, 32 );
         var material = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
         var plane = new THREE.Mesh( geometry, material );
        //  plane.rotateZ(0.5*Math.PI)
        //  plane.rotateY(0.5*Math.PI)
         plane.rotateX(0.5*Math.PI)
         var plane11  = plane.clone();
         plane11.position.set(-1000,0,0);
         planesG.add(plane11)
         var plane12  = plane.clone();
         plane12.position.set(0,0,0);
         planesG.add(plane12)
         var plane13  = plane.clone();
         plane13.position.set(1000,0,0);
         planesG.add(plane13)
         plane.rotateZ(0.5*Math.PI)
         var plane0  = plane.clone();
         plane.position.set(-650,0,450);
         planesG.add(plane)
         plane0.position.set(500,0,-350);
         planesG.add(plane0)
         //
       

         group1.add( planesG );
         //添加箭头
         var Maploader = new THREE.TextureLoader()
         var geometry = new THREE.PlaneGeometry( 100, 200, 32 );
         var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide,map:Maploader.load( './models/img/left.png' ),transparent:true});
         var planeA = new THREE.Mesh(geometry,material);
         planeA.rotateX(0.5*Math.PI)

         planeA.position.set(0,3,0);
         var planeA00 = planeA.clone();
         planeA00.position.set(0,3,-550)
         var planeA0 = planeA.clone();
         planeA0.position.set(-1000,3,0)
         planeA0.rotateX(Math.PI)
         var planeA1 = planeA0.clone();
         planeA1.position.set(1000,3,0)
         var planeA11 = planeA1.clone()
         planeA11.position.set(1000,3,600)
         var planeA2 = planeA.clone();
         planeA2.rotateZ(0.5*Math.PI)
         var planeA3 = planeA2.clone();
         planeA2.position.set(400,3,-350)
         planeA3.position.set(-800,3,450)
         group1.add(planeA)
         group1.add(planeA00)
         group1.add(planeA0)
         group1.add(planeA1)
         group1.add(planeA11)
         group1.add(planeA2)
         group1.add(planeA3)

 
    //添加页面
    var nodes=[]
    for(var i=0;i<5;i++){
        var element = document.createElement( 'div' );
        element.className = 'tag';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
        
        var number = document.createElement( 'div' );
        number.className = 'number';
        number.textContent = "出气压力:120Mpa";
        element.appendChild( number );
        var symbol = document.createElement( 'div' );
        symbol.className = 'symbol';
        symbol.textContent = "温度:80°C";
        element.appendChild( symbol );
        var details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = "瞬时流量:0.3MIm³" + '累计流量:0.3MIm³'+i;
        element.appendChild( details );
        Root.Root.appendChild(element)
        nodes.push(element);
    }
   
    
    // scene.add(particle);
    //添加提示
    tipObjects[0].position.set(-30,600,450)
    tipObjects[1].position.set(150,200,-300)
    tipObjects[2].position.set(-1000,300,400)
    
    //加气桩
    tipObjects[3].position.set(900, 320, 1000)
    tipObjects[4].position.set(0, 320, -1000)

    tipObjects.forEach(function(d){
        group1.add(d)
    })

    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        //重复渲染
        move(planeA,'z',[-100,200],-1)
        move(planeA00,'z',[-800,-550],-1)
        move(planeA0,'z',[0,300],2)
        move(planeA1,'z',[-100,230],1)
        move(planeA11,'z',[600,830],1)
        move(planeA2,'x',[400,800],1)
        move(planeA3,'x',[-800,-300],1)
        updateNode()
        // camera.position.rotateOnWorldAxis(new THREE.Vector3(0,1,0),0.002)
        group1.rotation.y+=0.002;
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    function move(obj,type,M,step){
       if(step>0){
        if(obj.position[type]>M[1]||obj.position[type]<M[0]){
            obj.position[type]=M[0]
        }
       }else{
        if(obj.position[type]>=M[1]||obj.position[type]<=M[0]){
            obj.position[type]=M[1]
        } 
       }
        obj.position[type]+=step;        
    }
    function updateNode(){
        var vector
        var x=0,y=0
        nodes.forEach(function(d,i){
            vector = tipObjects[i].getWorldPosition().project(camera)
            x=Math.round(vector.x * Root.W/2 + Root.W/2 -80)
            y=Math.round(-vector.y * Root.H/2 + Root.H/2 -40 )
            d.style.top=y+'px';
            d.style.left=x+'px';
        })
    }
}