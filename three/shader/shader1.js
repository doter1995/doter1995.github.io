var Shader = function(){
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
    this.node = document.getElementById('root')
    this.scene = new THREE.Scene()
    this.height = window.innerHeight - 4
    this.width = window.innerWidth - 4
    this.camera = null
    this.controls = null
    this.add = true
    this.unifroms = {
      time: {type:'f', value: 40.0 },
      t: { value: 0.0 },
      l: { value: 60.0 },
      size: { value: 10.0 },
      color: { value: new THREE.Color(0xff0000) },
    } 
    this.init = function () {
        this.node = document.getElementById('root')
        //创建场景
        this.renderer.setSize(this.width, this.height)
        //创建场景
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 50, 2100)
        this.camera.position.set(0, 0, 400)
        this.camera.lookAt(0, 0, 0)
        var axesHelper = new THREE.AxisHelper(5000);
        this.scene.add(axesHelper);
        this.initObj(this.scene, './model/shadow.obj')
        this.node.appendChild(this.renderer.domElement)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.animate()
      }
    this.initObj = function(g, path) {
        var loader = new THREE.OBJLoader()
        var that = this
        that.unifroms['texture'] = { value: new THREE.TextureLoader().load('./point.png') }
        loader.load(path, (mesh) => {
          var shaderMaterial = new THREE.ShaderMaterial({
            uniforms:that.unifroms,
            vertexShader: this.getShader('vertex'),
            fragmentShader: this.getShader('fragment'),
            blending: THREE.NoBlending,
            transparent: true,
          })
          var plane = new THREE.Points(mesh.children[0].geometry, shaderMaterial)
          plane.scale.set(5, 5, 5)
          g.add(plane)
        })
      }
      this.getShader = function (type) {
        if (type == 'vertex') {
          return `
            uniform float time;
            uniform float l;
            uniform float size;
            uniform float t;
            void main(void) {
              vec3 v = position;
              float state1 = l * t;
              if(v.y > state1){
                v.y = state1 ;
              }
              vec4 mvPosition = modelViewMatrix * vec4( v, 1.0);
              gl_PointSize = size*(150.0/-mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
            `
        } else if ('fragment') {
          return `
            uniform float time;
            uniform sampler2D texture;
            void main(void) {
              gl_FragColor = vec4(0.2,0.5,0.9,1.0);
            }
            `
        }
      }
    this.animate = function() {
        if(this.add){
          this.unifroms.t.value += 0.002
        }else{
          this.unifroms.t.value -= 0.002
        }
        if(this.unifroms.t.value >= 1.0){
          this.add = false
        }else if(this.unifroms.t.value <= 0.0){
          this.add = true
        }
        
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.setSize(this.width, this.height)
        this.renderer.render(this.scene, this.camera)
    }
} 