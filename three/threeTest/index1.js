// import THREE from 'three'
window.onload = function () {
    console.log("this Root verion:", THREE.REVISION)
    const IW = 1000,IH=2000;
    var Root = {
        W: window.innerWidth,
        H: window.innerHeight,
        Root: document.getElementById('root'),
    }
    var renderer = new THREE.WebGLRenderer({ antialias: true })
    //建议设置大小，否则会出现锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    Root.Root.appendChild(renderer.domElement)
    //创建场景
    var scene = new THREE.Scene();
    var group1 = new THREE.Group();
    // scene.add(group1);
    var camera = new THREE.PerspectiveCamera(60, Root.W / Root.H, 0.1, 200000);
    camera.position.set(100, 100, 100);
    // camera.position.set(-117.5,191.6,-290.7);
    camera.lookAt(scene.position);

    //设置场景背景色
    scene.background = new THREE.Color(0x111111);
    var amblight = new THREE.AmbientLight(0xffffff, 0.7);

    scene.add(amblight);
    var light = new THREE.DirectionalLight('#FFF', 1);
    light.position.set(0, 2000, 0);
    scene.add(light);
    var textureLoader = new THREE.TextureLoader();
    var mapC = textureLoader.load( "./models/img/sprite2.png");
    var materialC = new THREE.SpriteMaterial( { map: mapC, color: 0xffffff, fog: true } );
    var sprite = new THREE.Sprite( materialC );
    sprite.scale.set( 50, 50, 1 )
    scene.add(sprite);
       //添加提示框
      
    //添加一个控制器
    var orbitControl = new THREE.OrbitControls(camera);
    function animate() {
        renderer.setSize(window.innerWidth, window.innerHeight);
   
        
        
        // group1.rotation.y=+0.002
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
}