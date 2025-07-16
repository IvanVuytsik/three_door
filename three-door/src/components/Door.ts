import * as THREE from 'three'

export function createDoor(params: { width: number; height: number }): THREE.Group {
  const group = new THREE.Group()

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/textures/door_texture.jpg')

  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)

  const panelMat = new THREE.MeshStandardMaterial({
    map: texture,
    color: new THREE.Color(0x8b5a2b),
    roughness: 0.7,
    metalness: 0.1,
    transparent: false,
    side: THREE.DoubleSide,
  })

  const panelGeo = new THREE.BoxGeometry(params.width, params.height, 0.1)
  panelGeo.attributes.uv2 = panelGeo.attributes.uv

  const panel = new THREE.Mesh(panelGeo, panelMat)
  panel.castShadow = true
  panel.name = 'door-panel'
  panel.position.set(0, params.height / 2, 0)
  group.add(panel)

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x3d2f1c })
  const frameThickness = 0.1

  const left = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, params.height, 0.1), frameMat)
  left.position.set(-params.width / 2 - frameThickness / 2, params.height / 2, 0)
  const right = left.clone()
  right.position.set(params.width / 2 + frameThickness / 2, params.height / 2, 0)
  const top = new THREE.Mesh(new THREE.BoxGeometry(params.width + frameThickness * 2, frameThickness, 0.1), frameMat)
  top.position.set(0, params.height + frameThickness / 2, 0)

  group.add(left, right, top)

  const handleGeo = new THREE.TorusGeometry(0.05, 0.015, 16, 100)
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 })
  const handle = new THREE.Mesh(handleGeo, handleMat)
  handle.rotation.x = Math.PI / 2
  handle.name = 'door-handle'
  handle.position.set(params.width / 2 - 0.15, params.height / 2, 0.07)
  group.add(handle)

  return group
}

export function updateDoor(group: THREE.Group, params: { width: number; height: number }) {
  const panel = group.getObjectByName('door-panel') as THREE.Mesh
  const frameThickness = 0.1

  panel.geometry.dispose()
  panel.geometry = new THREE.BoxGeometry(params.width, params.height, 0.1)
  panel.geometry.attributes.uv2 = panel.geometry.attributes.uv
  panel.position.set(0, params.height / 2, 0)

  const mat = panel.material as THREE.MeshStandardMaterial
  if (mat.map) {
    mat.map.wrapS = mat.map.wrapT = THREE.ClampToEdgeWrapping
    mat.map.repeat.set(1, 1)
    mat.map.offset.set(0, 0)
    mat.map.needsUpdate = true
  }
  mat.color.set(0x8b5a2b)
  mat.roughness = 0.7
  mat.metalness = 0.1

  const left = group.children[1] as THREE.Mesh
  const right = group.children[2] as THREE.Mesh
  const top = group.children[3] as THREE.Mesh

  left.geometry.dispose()
  left.geometry = new THREE.BoxGeometry(frameThickness, params.height, 0.1)
  left.position.set(-params.width / 2 - frameThickness / 2, params.height / 2, 0);
  (left.material as THREE.MeshStandardMaterial).color.set(0x3d2f1c)

  right.geometry.dispose()
  right.geometry = new THREE.BoxGeometry(frameThickness, params.height, 0.1)
  right.position.set(params.width / 2 + frameThickness / 2, params.height / 2, 0);
  (right.material as THREE.MeshStandardMaterial).color.set(0x3d2f1c)

  top.geometry.dispose()
  top.geometry = new THREE.BoxGeometry(params.width + frameThickness * 2, frameThickness, 0.1)
  top.position.set(0, params.height + frameThickness / 2, 0);
  (top.material as THREE.MeshStandardMaterial).color.set(0x3d2f1c)

  const handle = group.getObjectByName('door-handle') as THREE.Mesh
  handle.position.set(params.width / 2 - 0.15, params.height / 2, 0.07)
}
