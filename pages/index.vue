<template lang="pug">
  div.container
    canvas(id='stage')
    .name
      h1 Gabriel Corbel
</template>

<script>
import C from 'cannon'
import * as THREE from 'three'
import Menu from '@/assets/menu'
export default {
  data () {
    return {
      scene: null,
      clock: null,
      camera: null,
      container: null,
      height: null,
      width: null,
      world: null
    }
  },
  mounted () {
    this.container = document.getElementById('stage')
    this.height = window.innerHeight
    this.width = window.innerWidth
    this.world = new C.World()
    this.world.gravity.set(0, -50, 0)
    this.setup()
    this.bindEvents()
  },
  methods: {
    setup () {
      this.scene = new THREE.Scene()
      this.scene.fog = new THREE.Fog(0x202533, -1, 100)

      this.clock = new THREE.Clock()

      // Set options of our scene
      this.setCamera()
      this.setLights()
      this.setRender()

      this.addObjects()
      this.bindEvents()
      /* eslint-disable */
      const manager = new THREE.LoadingManager()
      manager.onProgress = function ( item, loaded, total ) {
        console.log('CA LOAD')
      }
      this.renderer.setAnimationLoop(() => { this.draw() })
    },
    bindEvents () {
      window.addEventListener('resize', () => {
        this.onResize()
      })
    },
    onResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight

      this.camera.aspect = this.width / this.height

      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
    },
    setCamera () {
      const aspect = window.innerWidth / window.innerHeight
      const distance = 15

      this.camera = new THREE.OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, -1, 100)

      this.camera.position.set(-5, 10, 10)
      this.camera.lookAt(new THREE.Vector3())
    },
    setLights () {
      /* eslint-disable */
      const ambientLight = new THREE.AmbientLight(0xcccccc)
      this.scene.add(ambientLight)

      const foreLight = new THREE.DirectionalLight(0xffffff, 0.5)
      foreLight.position.set(5, 5, 20)
      this.scene.add(foreLight)

      const backLight = new THREE.DirectionalLight(0xffffff, 1)
      backLight.position.set(-5, -5, -10)
      this.scene.add(backLight)
      /* eslint-enable */
    },
    setRender () {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.container
      })

      this.renderer.setClearColor(0x202533)
      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(window.devicePixelRatio)

      this.renderer.shadowMap.enabled = true

      this.renderer.setAnimationLoop(() => {
        this.draw()
      })
    },
    draw () {
      this.updatePhysics()
      this.renderer.render(this.scene, this.camera)
    },
    updatePhysics () {
      // We need this to synchronize three meshes and Cannon.js rigid bodies
      this.menu.update()
      // As simple as that!
      this.world.step(1 / 60)
    },
    addObjects () {
      this.menu = new Menu(this.scene, this.world, this.camera)
    }
  }
}
</script>

<style>
.name {
  display: none;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
