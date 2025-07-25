<template>
  <div ref="container" class="scene" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createDoor, updateDoor } from './Door'
import { createGUI } from '../utils/gui'

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const scene = new THREE.Scene()

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, '#e2f1ff')
  gradient.addColorStop(1, '#c1e0dd')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)

  const texture = new THREE.CanvasTexture(canvas)
  scene.background = texture

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(4, 4, 6)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value?.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const dirLight = new THREE.DirectionalLight(0xfff3e0, 1.6)
  dirLight.position.set(6, 10, 7)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 4096
  dirLight.shadow.mapSize.height = 4096
  dirLight.shadow.radius = 6
  dirLight.shadow.bias = -0.0005
  const d = 10
  dirLight.shadow.camera.left = -d
  dirLight.shadow.camera.right = d
  dirLight.shadow.camera.top = d
  dirLight.shadow.camera.bottom = -d
  dirLight.shadow.camera.near = 1
  dirLight.shadow.camera.far = 20
  scene.add(dirLight)
 
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xe6dfcc, roughness: 0.9, metalness: 0.04 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  ground.position.y = 0
  scene.add(ground)

  const cubeCamRT = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
  })
  const cubeCam = new THREE.CubeCamera(0.1, 1000, cubeCamRT)
  scene.add(cubeCam)

  const sphereCamRT = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
  })
  const sphereCam = new THREE.CubeCamera(0.1, 1000, sphereCamRT)
  scene.add(sphereCam)

  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2b5a3,
    metalness: 1,
    roughness: 0.05,
    envMap: cubeCamRT.texture
  })
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial)
  cube.position.set(-2, 0.5, 0)
  cube.castShadow = true
  scene.add(cube)

  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xa6d8ce,
    metalness: 1,
    roughness: 0.02,
    envMap: sphereCamRT.texture
  })
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sphereMaterial)
  sphere.position.set(2, 0.5, 0)
  sphere.castShadow = true
  scene.add(sphere)

  const doorParams = { width: 1, height: 2 }
  const door = createDoor(doorParams)
  door.position.set(0, 0, -3)
  door.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.name === 'door-panel') {
        child.position.y = doorParams.height / 2
      }
    }
  })
  scene.add(door)
  createGUI(doorParams, () => updateDoor(door, doorParams))

  let frame = 0

  function animate() {
    requestAnimationFrame(animate)

    if (frame % 60 === 0) {
      cube.visible = false
      cubeCam.position.copy(cube.position)
      cubeCam.update(renderer, scene)
      cube.visible = true

      sphere.visible = false
      sphereCam.position.copy(sphere.position)
      sphereCam.update(renderer, scene)
      sphere.visible = true
    }

    controls.update()
    renderer.render(scene, camera)
    frame++
  }

  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
