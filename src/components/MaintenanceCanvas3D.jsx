'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MaintenanceCanvas3D() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let animationFrameId
    let isDestroyed = false

    // Check motion preference and hover capability
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const isMobile = window.innerWidth < 768

    // Dimensions
    let width = container.clientWidth
    let height = container.clientHeight

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = isMobile ? 5.2 : 5.8

    // Capped Pixel Ratio for Mobile performance
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile, // Disable MSAA on mobile for max FPS
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(dpr)

    // Group for object + particles
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // 1. Primary Metallic TorusKnot (Streetwear Emblem)
    const geometry = isMobile
      ? new THREE.TorusKnotGeometry(0.9, 0.28, 64, 12)
      : new THREE.TorusKnotGeometry(1.0, 0.32, 100, 16)

    const material = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    })
    const mainMesh = new THREE.Mesh(geometry, material)
    mainGroup.add(mainMesh)

    // 2. Inner Glowing Wireframe Overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial)
    wireframeMesh.scale.set(1.02, 1.02, 1.02)
    mainGroup.add(wireframeMesh)

    // 3. Orbiting Particles
    const particleCount = isMobile ? 140 : 320
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i * 3 + 2] = radius * Math.cos(phi)
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isMobile ? 0.025 : 0.035,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    mainGroup.add(particleSystem)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(5, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xc8a96e, 2.0, 10)
    fillLight.position.set(-4, -3, -2)
    scene.add(fillLight)

    // Pointer Interaction State
    let targetRotationX = 0
    let targetRotationY = 0
    let mouseX = 0
    let mouseY = 0

    const handlePointerMove = (e) => {
      if (!supportsHover) return
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetRotationY = x * 0.8
      targetRotationX = y * 0.8
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0]
        const rect = container.getBoundingClientRect()
        mouseX = (touch.clientX - rect.left) / rect.width - 0.5
        mouseY = (touch.clientY - rect.top) / rect.height - 0.5
        targetRotationY = mouseX * 0.5
        targetRotationX = mouseY * 0.5
      }
    }

    if (supportsHover) {
      window.addEventListener('pointermove', handlePointerMove)
    } else {
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    // Resize Handler
    const handleResize = () => {
      if (!container || isDestroyed) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      if (isDestroyed) return
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()
      const speed = prefersReducedMotion ? 0.1 : 1.0

      // Autonomous Floating & Rotation
      mainGroup.rotation.y += 0.006 * speed
      mainGroup.rotation.x += 0.003 * speed
      particleSystem.rotation.y -= 0.002 * speed

      if (!prefersReducedMotion) {
        mainGroup.position.y = Math.sin(elapsedTime * 1.4) * (isMobile ? 0.12 : 0.2)
      }

      // Smooth Mouse / Touch Parallax Lerp
      if (supportsHover || mouseX !== 0) {
        mainMesh.rotation.y += (targetRotationY - mainMesh.rotation.y) * 0.05
        mainMesh.rotation.x += (targetRotationX - mainMesh.rotation.x) * 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup on unmount
    return () => {
      isDestroyed = true
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (supportsHover) {
        window.removeEventListener('pointermove', handlePointerMove)
      } else {
        window.removeEventListener('touchmove', handleTouchMove)
      }

      geometry.dispose()
      material.dispose()
      wireframeMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center select-none"
      style={{
        height: 'clamp(220px, 35vh, 420px)',
        maxHeight: '420px',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-auto cursor-grab active:cursor-grabbing" />
    </div>
  )
}
