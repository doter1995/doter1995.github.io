
var  BackG = function(){
  

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.node = document.getElementById('root')
    this.scene = new THREE.Scene()
    this.height = window.innerHeight - 4
    this.width = window.innerWidth - 4
    this.camera = null
    this.particles = new THREE.Group()
    this.uniforms = {
      time: { type: 'f', value: 4.0 },
      tick:{type:'f',value:1.0},
      analyser:{value:[0,0]},
      size: { type: 'f', value: 200.0 },
      color:{ value: new THREE.Color( 0xff0000 ) },
    }
    this.frame = 0
    this.lines = null
    this.plane = null
    this.pointLights = new THREE.Group()
    this.landIndex = 0
    this.controls=null
    this.music = null

 

  this.init = function() {
    this.node = document.getElementById('root')
    console.log(this.node)
    //创建场景
    this.renderer.setSize(this.width, this.height)
    //创建场景
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 50, 10100)
    this.camera.position.set(0, 1000, 1000)
    this.camera.lookAt(0, 0, 0)
    var axesHelper = new THREE.AxisHelper( 5000 );
    this.scene.add( axesHelper );
    this.music = new Music('./bg.mp3')
    setInterval(()=>{
      this.uniforms.analyser.value = this.music.getByteTimeDomainData()
    },100)
    //加入灯光
    this.initPaeticles(10000)
    this.initLand(10000, 10000, 50,50)
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.node.appendChild(this.renderer.domElement)
    this.animate()
  }
  this.initLand = function(width, height, step,step1) {
    var spriteText = []
    
    var land = new THREE.PlaneBufferGeometry(width, height, step, step1)
    
    config.pointes.map((item, i) => {
      spriteText.push(new THREE.TextureLoader().load(item.img))
    })
    this.uniforms['texture'] = {value:new THREE.TextureLoader().load('./img/point.png')}
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms:this.uniforms,
      vertexShader:this.getShader('vertex'),
      fragmentShader:this.getShader('fragment'),
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    var vLength = land.attributes.position.count
    var colors = new Float32Array( vLength * 3 );
    var color = new THREE.Color();
    for(var i=0;i<vLength;i++){
      var x = (Math.random()*5).toFixed(0)
      var y = (Math.random()*6).toFixed(0)
      var z = (Math.random()*7).toFixed(0)
      
      color.setRGB(x/9,y/9,z/9)
      color.toArray(colors,i*3)
    }
    land.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    console.log(land)
    var plane = new THREE.Points(land, shaderMaterial)
    plane.position.set(0,-1000,0)
    var group = new THREE.Group()
    group.add(plane)
    plane.rotation.x -= Math.PI * 0.55
    plane.rotation.z -= Math.PI * 0.3
    this.plane = plane
    this.scene.add(group)
  }
  this.updateLand=function(spend) {
    if (!this.land.vertices) return null
    for (var i = 0; i < this.land.vertices.length; i++) {
      this.land.vertices[i].z += Math.random()*10+(-5) 
    }
    this.land.verticesNeedUpdate = true
  }
  this.animate=function() {
    
    requestAnimationFrame(this.animate.bind(this))
    this.uniforms.time.value = this.frame
    if(this.landIndex <=10000 ){
      this.frame -= 0.14
    }else{
      this.frame -= 0.04
    }
    this.landIndex++
    this.updatePaeticles('z',800,2)
    this.uniforms.time.value = this.frame

    this.renderer.setSize(this.width, this.height)
    this.renderer.render(this.scene, this.camera)
  }
  // 构建粒子星空
  this.initPaeticles=function(Sp_Max) {
    var spriteMaterial, vertex
    var spriteText = []
    config.pointes.map((item, i) => {
      spriteText.push(new THREE.TextureLoader().load(item.img))
    })
    for (var i = -1000; i < Sp_Max; i += 20) {
      var x = (Math.random() * 6).toFixed(0)
      spriteMaterial = new THREE.SpriteMaterial({
        map: spriteText[x % config.pointes.length],
        blending: THREE.AdditiveBlending,
        transparent: true
      })
      vertex = new THREE.Sprite(spriteMaterial)
      vertex.scale.set(6, 6)
      vertex.position.x = Math.random() * 1000 - 1000 * 0.5
      vertex.position.y = Math.random() * 1000 - 1000 * 0.5
      vertex.position.z = Math.random() * 1000 - 1000 * 0.5
      this.particles.add(vertex)
    }
    this.scene.add(this.particles)
  }
  this.updatePaeticles=function(axis = 'y', max = 1000, spend = 10) {
    this.particles.children.map(vertex => {
      if (spend > 0 && vertex.position[axis] > max) {
        vertex.position.x = Math.random() * 1000 - 1000 * 0.5
        vertex.position.y = Math.random() * 1000 - 1000 * 0.5
        vertex.position.z = Math.random() * 1000 - 1000 * 0.5
        vertex.position[axis] = 0
      } else if (spend < 0 && vertex.position[axis] < max) {
        vertex.position.x = Math.random() * 1000 - 1000 * 0.5
        vertex.position.y = Math.random() * 1000 - 1000 * 0.5
        vertex.position.z = Math.random() * 1000 - 1000 * 0.5
        vertex.position[axis] = max
      } else {
        vertex.position[axis] += spend
      }
    })
  }
  this.getShader=function(type) {
    if (type == 'vertex') {
      return `
        uniform float time;
        uniform float size;
        uniform float tick;
        uniform float analyser[128];
        attribute vec4 color;
			  varying vec4 vColor;
      
        void main(void) {
          vColor = color;
          
          vec3 v = position;
          float a = mod(position.x,128.0);
          int index =int(ceil(a));
          v.z += cos(2.0 * position.x )+ tick*(analyser[index]-128.0);
          v.z += cos(2.0 * position.y ) + tick*(analyser[index]-128.0);
          vec4 mvPosition = modelViewMatrix * vec4( v, 1.0 );
          gl_PointSize = size*(150.0/-mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
      }
        `
    } else if ('fragment') {
      return `
       
        uniform float time;
        uniform sampler2D texture;

        varying vec4 vColor;
        
        void main(void) {
          vec4 outColor = texture2D( texture, gl_PointCoord );
          if ( outColor.r < 0.1 ) discard;
          if(outColor.r>0.8){
            gl_FragColor = vec4( vColor.rgb, 0.8);
          }else{
            gl_FragColor = vec4( vColor.rgb, outColor.r);
          }
          
          
          float depth = gl_FragCoord.z / gl_FragCoord.w;
          const vec3 fogColor = vec3(0.1,0.1,0.1);
          float fogFactor = smoothstep( 1.0,10000.0, depth );
          gl_FragColor = mix( gl_FragColor, vec4( fogColor,outColor.r ), fogFactor );
          
        }
        `
    }
  }
}
