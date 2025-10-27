import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './PlanetaryScene.css'

interface PlanetConfig {
  name: string
  link: string
  color: number
  emissive: number
  radius: number
  x: number
  y: number
  z: number
}

export default function PlanetaryScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [targetPlanet, setTargetPlanet] = useState<string | null>(null)
  const [isFlying, setIsFlying] = useState(false)
  const [isImmersiveMode, setIsImmersiveMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e27)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 35)

    // Renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // Create spaceship with tether cable
    const spaceshipGroup = new THREE.Group()
    
    // Main spaceship body
    const shipBodyGeometry = new THREE.CylinderGeometry(2, 2.5, 8, 8)
    const shipBodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc, 
      metalness: 0.9, 
      roughness: 0.2 
    })
    const shipBody = new THREE.Mesh(shipBodyGeometry, shipBodyMaterial)
    shipBody.rotation.x = Math.PI / 2
    spaceshipGroup.add(shipBody)
    
    // Spaceship cockpit
    const cockpitGeometry = new THREE.SphereGeometry(1.5, 16, 16)
    const cockpitMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4488ff, 
      metalness: 0.8, 
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    })
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial)
    cockpit.position.z = 3
    spaceshipGroup.add(cockpit)
    
    // Engine thrusters (glowing)
    for (let i = 0; i < 4; i++) {
      const thrusterGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 8)
      const thrusterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        emissive: 0xff6600,
        emissiveIntensity: 0.5
      })
      const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial)
      thruster.rotation.x = Math.PI / 2
      const angle = (i * Math.PI * 2) / 4
      thruster.position.x = Math.cos(angle) * 1.5
      thruster.position.y = Math.sin(angle) * 1.5
      thruster.position.z = -4
      spaceshipGroup.add(thruster)
      
      // Engine glow
      const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600, 
        transparent: true, 
        opacity: 0.6 
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(thruster.position)
      glow.position.z -= 0.5
      spaceshipGroup.add(glow)
    }
    
    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(6, 0.1, 2)
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a3e, 
      metalness: 0.5, 
      roughness: 0.3 
    })
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    leftPanel.position.set(-4, 0, 0)
    spaceshipGroup.add(leftPanel)
    
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    rightPanel.position.set(4, 0, 0)
    spaceshipGroup.add(rightPanel)
    
    // Position spaceship behind and to the side of camera
    spaceshipGroup.position.set(-8, 3, 25)
    spaceshipGroup.rotation.y = Math.PI / 6
    scene.add(spaceshipGroup)
    
    // Create tether cable connecting astronaut to ship
    const tetherPoints: THREE.Vector3[] = []
    const tetherSegments = 50
    for (let i = 0; i <= tetherSegments; i++) {
      const t = i / tetherSegments
      // Create a curve from camera to ship
      const x = THREE.MathUtils.lerp(0, spaceshipGroup.position.x, t)
      const y = THREE.MathUtils.lerp(5, spaceshipGroup.position.y, t) + Math.sin(t * Math.PI) * 2
      const z = THREE.MathUtils.lerp(35, spaceshipGroup.position.z, t)
      tetherPoints.push(new THREE.Vector3(x, y, z))
    }
    
    const tetherGeometry = new THREE.BufferGeometry().setFromPoints(tetherPoints)
    const tetherMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffaa00, 
      linewidth: 2 
    })
    const tetherCable = new THREE.Line(tetherGeometry, tetherMaterial)
    scene.add(tetherCable)
    
    // Create astronaut hands/arms visible in first person
    const astronautGroup = new THREE.Group()
    
    // Left glove
    const leftGloveGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const gloveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      metalness: 0.3, 
      roughness: 0.7 
    })
    const leftGlove = new THREE.Mesh(leftGloveGeometry, gloveMaterial)
    leftGlove.position.set(-0.8, -1.2, -1.5)
    leftGlove.scale.set(1.2, 1, 1.5)
    astronautGroup.add(leftGlove)
    
    // Left arm
    const leftArmGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8)
    const armMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe0e0e0, 
      metalness: 0.2, 
      roughness: 0.8 
    })
    const leftArm = new THREE.Mesh(leftArmGeometry, armMaterial)
    leftArm.position.set(-0.7, -0.6, -1.3)
    leftArm.rotation.z = -0.3
    astronautGroup.add(leftArm)
    
    // Right glove
    const rightGlove = new THREE.Mesh(leftGloveGeometry, gloveMaterial)
    rightGlove.position.set(0.8, -1.2, -1.5)
    rightGlove.scale.set(1.2, 1, 1.5)
    astronautGroup.add(rightGlove)
    
    // Right arm
    const rightArm = new THREE.Mesh(leftArmGeometry, armMaterial)
    rightArm.position.set(0.7, -0.6, -1.3)
    rightArm.rotation.z = 0.3
    astronautGroup.add(rightArm)
    
    // Helmet visor edge (partially visible at screen edges)
    const visorGeometry = new THREE.TorusGeometry(1.2, 0.08, 8, 32, Math.PI * 1.8)
    const visorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      metalness: 0.8, 
      roughness: 0.2 
    })
    const visorEdge = new THREE.Mesh(visorGeometry, visorMaterial)
    visorEdge.position.set(0, -0.3, -1)
    visorEdge.rotation.x = -0.3
    astronautGroup.add(visorEdge)
    
    // Helmet HUD elements (thin lines at screen edges)
    const hudMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.3 
    })
    
    // Top HUD line
    const topHudPoints = [
      new THREE.Vector3(-1, 0.8, -1.2),
      new THREE.Vector3(1, 0.8, -1.2)
    ]
    const topHudGeometry = new THREE.BufferGeometry().setFromPoints(topHudPoints)
    const topHud = new THREE.Line(topHudGeometry, hudMaterial)
    astronautGroup.add(topHud)
    
    // Bottom HUD line
    const bottomHudPoints = [
      new THREE.Vector3(-1, -1.5, -1.2),
      new THREE.Vector3(1, -1.5, -1.2)
    ]
    const bottomHudGeometry = new THREE.BufferGeometry().setFromPoints(bottomHudPoints)
    const bottomHud = new THREE.Line(bottomHudGeometry, hudMaterial)
    astronautGroup.add(bottomHud)
    
    // Attach astronaut group to camera
    camera.add(astronautGroup)
    scene.add(camera)

    // Stars - reduced count for better performance
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = []
    const starCount = 1000 // Reduced from 2000
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      )
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Planet configurations
    const planetConfigs: PlanetConfig[] = [
      { name: 'Mathematics', link: '/topics/math', color: 0x3b82f6, emissive: 0x60a5fa, radius: 1.8, x: -15, y: 5, z: -10 },
      { name: 'Physics', link: '/topics/physics', color: 0x8b5cf6, emissive: 0xa78bfa, radius: 1.5, x: 10, y: -3, z: -15 },
      { name: 'Chemistry', link: '/topics/chemistry', color: 0xec4899, emissive: 0xf472b6, radius: 2.0, x: -8, y: -5, z: 5 },
      { name: 'Biology', link: '/topics/biology', color: 0x10b981, emissive: 0x34d399, radius: 1.3, x: 18, y: 3, z: -5 },
      { name: 'History', link: '/topics/history', color: 0xf59e0b, emissive: 0xfbbf24, radius: 1.6, x: -12, y: 8, z: 8 },
      { name: 'Literature', link: '/topics/literature', color: 0xef4444, emissive: 0xf87171, radius: 1.4, x: 5, y: -8, z: 12 },
      { name: 'Computer Science', link: '/topics/cs', color: 0x06b6d4, emissive: 0x22d3ee, radius: 1.7, x: -20, y: -2, z: -8 },
      { name: 'Philosophy', link: '/topics/philosophy', color: 0x84cc16, emissive: 0xa3e635, radius: 1.2, x: 15, y: 7, z: 10 },
      { name: 'Psychology', link: '/topics/psychology', color: 0x6366f1, emissive: 0x818cf8, radius: 1.5, x: -5, y: 2, z: -20 },
      { name: 'Economics', link: '/topics/economics', color: 0xf97316, emissive: 0xfb923c, radius: 1.9, x: 8, y: -6, z: -12 },
      { name: 'Art', link: '/topics/art', color: 0xd946ef, emissive: 0xe879f9, radius: 1.3, x: -18, y: -4, z: 15 },
      { name: 'Engineering', link: '/topics/engineering', color: 0x14b8a6, emissive: 0x2dd4bf, radius: 1.6, x: 12, y: 5, z: 8 },
      { name: 'Music', link: '/topics/music', color: 0xfbbf24, emissive: 0xfcd34d, radius: 1.1, x: -10, y: -7, z: -18 },
      { name: 'Astronomy', link: '/topics/astronomy', color: 0xa855f7, emissive: 0xc084fc, radius: 1.8, x: 20, y: 0, z: 5 },
      { name: 'Geography', link: '/topics/geography', color: 0x0ea5e9, emissive: 0x38bdf8, radius: 1.4, x: -15, y: 6, z: -15 },
      { name: 'Language', link: '/topics/language', color: 0xfb7185, emissive: 0xfda4af, radius: 1.5, x: 6, y: 8, z: -8 },
      { name: 'Sociology', link: '/topics/sociology', color: 0x22c55e, emissive: 0x4ade80, radius: 1.2, x: -8, y: -9, z: 18 },
      { name: 'Anthropology', link: '/topics/anthropology', color: 0xeab308, emissive: 0xfacc15, radius: 1.7, x: 16, y: -5, z: 15 },
    ]

    // Create realistic planets with detailed textures
    const planets: Array<{
      mesh: THREE.Mesh
      atmosphere?: THREE.Mesh
      glow?: THREE.Mesh
      data: PlanetConfig
      baseY: number
      floatSpeed: number
      floatOffset: number
      rotationSpeed: THREE.Vector3
    }> = []

    planetConfigs.forEach((config) => {
      // Main planet with simplified geometry for performance
      const geometry = new THREE.SphereGeometry(config.radius, 32, 32) // Reduced from 64,64
      
      // Simplified material - skip expensive canvas texture generation
      const material = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.emissive,
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.8,
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(config.x, config.y, config.z)
      mesh.userData = { name: config.name, link: config.link }
      mesh.castShadow = false // Disable shadows for performance
      mesh.receiveShadow = false
      scene.add(mesh)

      // Atmospheric glow
      const glowGeometry = new THREE.SphereGeometry(config.radius * 1.15, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: config.emissive,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(mesh.position)
      scene.add(glow)

      // Outer atmosphere
      const atmosphereGeometry = new THREE.SphereGeometry(config.radius * 1.08, 32, 32)
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: config.emissive,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
      })
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
      atmosphere.position.copy(mesh.position)
      scene.add(atmosphere)

      planets.push({
        mesh,
        atmosphere,
        glow,
        data: config,
        baseY: config.y,
        floatSpeed: 0.0005 + Math.random() * 0.001,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
      })
    })

    // Flight controls
    const keys = new Set<string>()
    let mouseX = 0
    let mouseY = 0
    let pitch = 0
    let yaw = 0
    let isPointerLocked = false
    let rocketMesh: THREE.Group | null = null
    let isRocketFlying = false
    let rocketStart = new THREE.Vector3()
    let rocketEnd = new THREE.Vector3()
    let rocketProgress = 0

    // Create rocket
    const createRocket = () => {
      const rocket = new THREE.Group()
      
      // Rocket body (cone)
      const bodyGeometry = new THREE.ConeGeometry(0.3, 1.5, 8)
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.8, 
        roughness: 0.2 
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.rotation.x = Math.PI
      rocket.add(body)
      
      // Rocket nose (smaller cone)
      const noseGeometry = new THREE.ConeGeometry(0.3, 0.5, 8)
      const noseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff4444, 
        metalness: 0.6, 
        roughness: 0.3 
      })
      const nose = new THREE.Mesh(noseGeometry, noseMaterial)
      nose.position.y = 0.75
      nose.rotation.x = Math.PI
      rocket.add(nose)
      
      // Fins
      const finGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.6)
      const finMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4444ff, 
        metalness: 0.7, 
        roughness: 0.2 
      })
      
      for (let i = 0; i < 3; i++) {
        const fin = new THREE.Mesh(finGeometry, finMaterial)
        fin.position.y = -0.5
        fin.rotation.y = (i * Math.PI * 2) / 3
        fin.position.x = Math.cos((i * Math.PI * 2) / 3) * 0.3
        fin.position.z = Math.sin((i * Math.PI * 2) / 3) * 0.3
        rocket.add(fin)
      }
      
      // Engine glow
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff8800, 
        transparent: true, 
        opacity: 0.8 
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.y = -0.9
      rocket.add(glow)
      
      // Flame particles
      const flameGeometry = new THREE.ConeGeometry(0.2, 0.8, 8)
      const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600, 
        transparent: true, 
        opacity: 0.7 
      })
      const flame = new THREE.Mesh(flameGeometry, flameMaterial)
      flame.position.y = -1.3
      rocket.add(flame)
      
      rocket.scale.set(0.8, 0.8, 0.8)
      return rocket
    }

    const onKeyDown = (e: KeyboardEvent) => keys.add(e.key.toLowerCase())
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())

    const onKeyDownImmersive = (e: KeyboardEvent) => {
      // Prevent default browser behavior for movement keys in immersive mode
      if (isPointerLocked && isImmersiveMode) {
        const key = e.key.toLowerCase()
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      keys.add(e.key.toLowerCase())
    }

    const onKeyUpImmersive = (e: KeyboardEvent) => {
      if (isPointerLocked && isImmersiveMode) {
        const key = e.key.toLowerCase()
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      keys.delete(e.key.toLowerCase())
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isPointerLocked) {
        mouseX = e.movementX || 0
        mouseY = e.movementY || 0
      }
    }

    const onClick = () => {
      if (!isPointerLocked) {
        renderer.domElement.requestPointerLock()
      } else {
        // Check if clicking on a planet - use longer ray distance for close-range detection
        const raycaster = new THREE.Raycaster()
        raycaster.far = 100 // Extend ray distance
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh))
        if (intersects.length > 0 && !isRocketFlying) {
          const planet = intersects[0].object as THREE.Mesh
          const targetLink = planet.userData.link
          const distance = camera.position.distanceTo(planet.position)
          
          // If very close to planet, navigate immediately
          if (distance < 5) {
            window.location.href = targetLink
            return
          }
          
          // Launch rocket animation for distant planets
          isRocketFlying = true
          rocketProgress = 0
          rocketStart.copy(camera.position)
          rocketEnd.copy(planet.position)
          
          if (!rocketMesh) {
            rocketMesh = createRocket()
            scene.add(rocketMesh)
          }
          
          rocketMesh.position.copy(rocketStart)
          rocketMesh.visible = true
          
          // Point rocket toward target
          rocketMesh.lookAt(rocketEnd)
          
          // Navigate after animation
          setTimeout(() => {
            window.location.href = targetLink
          }, 2000)
        }
      }
    }

    const onPointerLockChange = () => {
      const wasLocked = isPointerLocked
      isPointerLocked = document.pointerLockElement === renderer.domElement
      setIsFlying(isPointerLocked)
      setIsImmersiveMode(isPointerLocked)
      
      console.log('Pointer lock changed:', isPointerLocked ? 'LOCKED' : 'UNLOCKED')
    }
    
    const onFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)
      console.log('Fullscreen changed:', isCurrentlyFullscreen ? 'ON' : 'OFF')
    }

    document.addEventListener('keydown', onKeyDownImmersive, true)
    document.addEventListener('keyup', onKeyUpImmersive, true)
    document.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('fullscreenchange', onFullscreenChange)

    // Animation with performance optimizations
    let time = 0
    const clock = new THREE.Clock()
    const moveSpeed = 0.3
    let frameCount = 0

    const raycaster = new THREE.Raycaster()
    const animate = () => {
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      time += delta
      frameCount++

      // Skip expensive operations on some frames for better FPS
      const shouldUpdateExpensive = frameCount % 2 === 0

      // Rotate stars less frequently
      if (shouldUpdateExpensive) {
        stars.rotation.y += 0.0002
        stars.rotation.x += 0.0001
      }
      
      // Update tether cable to follow camera
      const newTetherPoints: THREE.Vector3[] = []
      for (let i = 0; i <= tetherSegments; i++) {
        const t = i / tetherSegments
        const x = THREE.MathUtils.lerp(camera.position.x, spaceshipGroup.position.x, t)
        const y = THREE.MathUtils.lerp(camera.position.y, spaceshipGroup.position.y, t) + Math.sin(t * Math.PI + time) * 1.5
        const z = THREE.MathUtils.lerp(camera.position.z, spaceshipGroup.position.z, t)
        newTetherPoints.push(new THREE.Vector3(x, y, z))
      }
      tetherCable.geometry.setFromPoints(newTetherPoints)
      
      // Animate spaceship gently
      spaceshipGroup.rotation.x = Math.sin(time * 0.3) * 0.05
      spaceshipGroup.rotation.y = Math.PI / 6 + Math.cos(time * 0.2) * 0.1

      // Update planets
      planets.forEach((planet) => {
        planet.mesh.position.y = planet.baseY + Math.sin(time * planet.floatSpeed + planet.floatOffset) * 0.5
        planet.mesh.rotation.x += planet.rotationSpeed.x
        planet.mesh.rotation.y += planet.rotationSpeed.y
        planet.mesh.rotation.z += planet.rotationSpeed.z
        
        // Update atmosphere and glow positions
        if (planet.atmosphere) {
          planet.atmosphere.position.copy(planet.mesh.position)
          planet.atmosphere.rotation.y += 0.001
        }
        if (planet.glow) {
          planet.glow.position.copy(planet.mesh.position)
        }
      })

      // Rocket animation
      if (isRocketFlying && rocketMesh) {
        rocketProgress += 0.015
        
        if (rocketProgress >= 1) {
          rocketProgress = 1
          rocketMesh.visible = false
          isRocketFlying = false
        } else {
          // Smooth movement with easing
          const easeProgress = 1 - Math.pow(1 - rocketProgress, 3)
          rocketMesh.position.lerpVectors(rocketStart, rocketEnd, easeProgress)
          rocketMesh.lookAt(rocketEnd)
          
          // Add wobble/rotation for realism
          rocketMesh.rotation.z = Math.sin(time * 20) * 0.1
          
          // Scale up slightly as it flies
          const scale = 0.8 + easeProgress * 0.4
          rocketMesh.scale.set(scale, scale, scale)
          
          // Particle trail effect
          if (Math.random() > 0.7) {
            const trailGeometry = new THREE.SphereGeometry(0.1, 8, 8)
            const trailMaterial = new THREE.MeshBasicMaterial({ 
              color: 0xff6600, 
              transparent: true, 
              opacity: 0.6 
            })
            const trail = new THREE.Mesh(trailGeometry, trailMaterial)
            trail.position.copy(rocketMesh.position)
            scene.add(trail)
            
            // Remove trail after a short time
            setTimeout(() => {
              scene.remove(trail)
              trailGeometry.dispose()
              trailMaterial.dispose()
            }, 500)
          }
        }
      }

      // Flight controls
      if (isPointerLocked) {
        // Mouse look
        yaw -= mouseX * 0.002
        pitch -= mouseY * 0.002
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))
        mouseX = 0
        mouseY = 0

        // Apply rotation
        camera.rotation.order = 'YXZ'
        camera.rotation.y = yaw
        camera.rotation.x = pitch

        // Movement
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        const up = new THREE.Vector3(0, 1, 0)

        if (keys.has('w') || keys.has('arrowup')) camera.position.add(forward.multiplyScalar(moveSpeed))
        if (keys.has('s') || keys.has('arrowdown')) camera.position.add(forward.multiplyScalar(-moveSpeed))
        if (keys.has('a') || keys.has('arrowleft')) camera.position.add(right.multiplyScalar(-moveSpeed))
        if (keys.has('d') || keys.has('arrowright')) camera.position.add(right.multiplyScalar(moveSpeed))
        if (keys.has(' ')) camera.position.add(up.multiplyScalar(moveSpeed))
        if (keys.has('shift')) camera.position.add(up.multiplyScalar(-moveSpeed))

        // Check planet targeting
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh))
        if (intersects.length > 0) {
          const planet = intersects[0].object as THREE.Mesh
          setTargetPlanet(planet.userData.name)
          const material = planet.material as THREE.MeshStandardMaterial
          material.emissiveIntensity = 0.8
          
          // Enhanced glow effect on targeted planet
          planets.forEach((p) => {
            if (p.mesh === planet) {
              const scale = 1 + Math.sin(time * 3) * 0.05
              p.mesh.scale.set(scale, scale, scale)
              if (p.glow) {
                const glowMat = p.glow.material as THREE.MeshBasicMaterial
                glowMat.opacity = 0.3 + Math.sin(time * 3) * 0.1
                p.glow.scale.set(scale * 1.2, scale * 1.2, scale * 1.2)
              }
            } else {
              p.mesh.scale.set(1, 1, 1)
              const mat = p.mesh.material as THREE.MeshStandardMaterial
              mat.emissiveIntensity = 0.3
              if (p.glow) {
                const glowMat = p.glow.material as THREE.MeshBasicMaterial
                glowMat.opacity = 0.15
                p.glow.scale.set(1, 1, 1)
              }
            }
          })
        } else {
          setTargetPlanet(null)
          planets.forEach((p) => {
            p.mesh.scale.set(1, 1, 1)
            const material = p.mesh.material as THREE.MeshStandardMaterial
            material.emissiveIntensity = 0.3
            if (p.glow) {
              const glowMat = p.glow.material as THREE.MeshBasicMaterial
              glowMat.opacity = 0.15
              p.glow.scale.set(1, 1, 1)
            }
          })
        }
      } else {
        // Orbit camera when not flying
        const orbitRadius = 40
        const orbitSpeed = 0.1
        camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius
        camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius
        camera.position.y = 5 + Math.sin(time * 0.15) * 2
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }

    // Start animation and remove loading state
    animate()
    setIsLoading(false)

    // Handle resize
    const onResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', onKeyDownImmersive, true)
      document.removeEventListener('keyup', onKeyUpImmersive, true)
      document.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      window.removeEventListener('resize', onResize)
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock()
      }
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Fullscreen toggle handler
  const toggleFullscreen = async () => {
    if (!mountRef.current) return
    
    try {
      if (!document.fullscreenElement) {
        await mountRef.current.requestFullscreen()
        console.log('Entering fullscreen')
      } else {
        await document.exitFullscreen()
        console.log('Exiting fullscreen')
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <section className="relative w-full h-full bg-gradient-to-b from-slate-900 to-black overflow-hidden">
      <div className="w-full h-full">
        {/* 3D Scene */}
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-semibold">Loading Space Scene...</p>
                <p className="text-slate-400 text-sm mt-2">Preparing your journey through knowledge</p>
              </div>
            </div>
          )}
          <div ref={mountRef} className="w-full h-full planetary-scene-bg" />

          {/* Fullscreen Button - Always visible */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-20 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-lg border border-slate-600 transition-all duration-300 group"
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
          >
            <div className="flex items-center gap-2">
              {isFullscreen ? (
                <>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-slate-300 group-hover:text-white font-semibold text-sm transition-colors">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-slate-300 group-hover:text-white font-semibold text-sm transition-colors">Fullscreen</span>
                </>
              )}
            </div>
          </button>

          {/* Flight Mode UI */}
          {isFlying && (
            <>
              {/* Crosshair */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-white/50 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/80 rounded-full" />
                  <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white/50 -translate-y-1/2 -translate-x-full" />
                  <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white/50 -translate-y-1/2 translate-x-full" />
                  <div className="absolute left-1/2 top-0 w-0.5 h-3 bg-white/50 -translate-x-1/2 -translate-y-full" />
                  <div className="absolute left-1/2 bottom-0 w-0.5 h-3 bg-white/50 -translate-x-1/2 translate-y-full" />
                </div>
              </div>

              {/* Status */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-300 font-semibold text-sm">👨‍🚀 ASTRONAUT FLIGHT MODE</span>
                  </div>
                </div>
                {isImmersiveMode && (
                  <div className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/50">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-purple-300 font-semibold text-sm">IMMERSIVE MODE</span>
                    </div>
                  </div>
                )}
                <div className="px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-lg border border-orange-500/50">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-300 font-semibold text-xs">🔗 TETHERED TO SHIP</span>
                  </div>
                </div>
              </div>

              {/* Target Planet */}
              {targetPlanet && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/50 mt-16">
                  <span className="text-blue-300 font-semibold text-sm">🎯 {targetPlanet}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm">
              👨‍🚀 You're an <strong className="text-white">astronaut</strong> connected to your support ship by a tether cable
            </p>
            <p className="text-slate-400 text-sm">
              🎮 Click the <strong className="text-white">Fullscreen</strong> button, then click the scene to enter <strong className="text-white">Flight Mode</strong>
            </p>
            <p className="text-purple-400 text-xs">
              ⚡ Pro tip: Use fullscreen + flight mode for the best <strong className="text-purple-300">immersive astronaut experience</strong>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">WASD</kbd>
              <span className="ml-2 text-slate-400">Move</span>
            </div>
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">Mouse</kbd>
              <span className="ml-2 text-slate-400">Look</span>
            </div>
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">Space</kbd>
              <span className="ml-2 text-slate-400">Up</span>
            </div>
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">Shift</kbd>
              <span className="ml-2 text-slate-400">Down</span>
            </div>
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">ESC</kbd>
              <span className="ml-2 text-slate-400">Exit Flight</span>
            </div>
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs">F11</kbd>
              <span className="ml-2 text-slate-400">Fullscreen</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs italic">
            💡 Immersive mode automatically prevents key conflicts with browser shortcuts when flying
          </p>
        </div>

        {/* Planet Grid */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-3">
              🌍 Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Knowledge Planets</span>
            </h3>
            <p className="text-slate-400">Explore 18 different fields of study in our interactive universe</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Mathematics', color: 'from-blue-500 to-blue-600', icon: '∑', shadow: 'shadow-blue-500/50' },
              { name: 'Physics', color: 'from-purple-500 to-purple-600', icon: '⚛️', shadow: 'shadow-purple-500/50' },
              { name: 'Chemistry', color: 'from-pink-500 to-pink-600', icon: '🧪', shadow: 'shadow-pink-500/50' },
              { name: 'Biology', color: 'from-green-500 to-green-600', icon: '🧬', shadow: 'shadow-green-500/50' },
              { name: 'History', color: 'from-amber-500 to-amber-600', icon: '📜', shadow: 'shadow-amber-500/50' },
              { name: 'Literature', color: 'from-red-500 to-red-600', icon: '📚', shadow: 'shadow-red-500/50' },
              { name: 'Computer Science', color: 'from-cyan-500 to-cyan-600', icon: '💻', shadow: 'shadow-cyan-500/50' },
              { name: 'Philosophy', color: 'from-lime-500 to-lime-600', icon: '🤔', shadow: 'shadow-lime-500/50' },
              { name: 'Psychology', color: 'from-indigo-500 to-indigo-600', icon: '🧠', shadow: 'shadow-indigo-500/50' },
              { name: 'Economics', color: 'from-orange-500 to-orange-600', icon: '📈', shadow: 'shadow-orange-500/50' },
              { name: 'Art', color: 'from-fuchsia-500 to-fuchsia-600', icon: '🎨', shadow: 'shadow-fuchsia-500/50' },
              { name: 'Engineering', color: 'from-teal-500 to-teal-600', icon: '⚙️', shadow: 'shadow-teal-500/50' },
              { name: 'Music', color: 'from-yellow-500 to-yellow-600', icon: '🎵', shadow: 'shadow-yellow-500/50' },
              { name: 'Astronomy', color: 'from-violet-500 to-violet-600', icon: '🔭', shadow: 'shadow-violet-500/50' },
              { name: 'Geography', color: 'from-sky-500 to-sky-600', icon: '🗺️', shadow: 'shadow-sky-500/50' },
              { name: 'Language', color: 'from-rose-500 to-rose-600', icon: '🗣️', shadow: 'shadow-rose-500/50' },
              { name: 'Sociology', color: 'from-emerald-500 to-emerald-600', icon: '👥', shadow: 'shadow-emerald-500/50' },
              { name: 'Anthropology', color: 'from-yellow-600 to-amber-600', icon: '🏛️', shadow: 'shadow-amber-500/50' },
            ].map((topic, index) => (
              <div 
                key={index} 
                className={`group relative p-5 rounded-2xl bg-gradient-to-br ${topic.color} text-white shadow-xl ${topic.shadow} hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <h4 className="font-bold text-sm leading-tight">
                    {topic.name}
                  </h4>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              </div>
            ))}
          </div>
          
          {/* Bottom decorative text */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              ✨ <span className="text-slate-400 font-semibold">Hover over a card</span> to see the magic happen!
            </p>
          </div>
        </div>

        {/* Controls Hint - Subtle overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <div className="px-6 py-3 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-2xl">
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-white font-semibold">Click the scene</span> to enter Flight Mode
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <kbd className="px-2 py-1 bg-slate-700/80 rounded text-white font-mono">WASD</kbd>
              <span className="text-slate-400">Move</span>
              <span className="text-slate-600">•</span>
              <kbd className="px-2 py-1 bg-slate-700/80 rounded text-white font-mono">Mouse</kbd>
              <span className="text-slate-400">Look</span>
              <span className="text-slate-600">•</span>
              <kbd className="px-2 py-1 bg-slate-700/80 rounded text-white font-mono">ESC</kbd>
              <span className="text-slate-400">Exit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

