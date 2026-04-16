'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, MeshDistortMaterial, Float, Stars } from '@react-three/drei'

function GoldRing() {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Torus ref={meshRef} args={[1, 0.35, 32, 100]}>
        <MeshDistortMaterial
          color="#c8a96e"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={1}
        />
      </Torus>
    </Float>
  )
}

function InnerSphere() {
  const ref = useRef()

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.8
  })

  return (
    <Float speed={3} floatIntensity={1.5}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshDistortMaterial
          color="#ffffff"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

export default function FloatingObject3D() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#c8a96e" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
        <GoldRing />
        <InnerSphere />
      </Canvas>
    </div>
  )
}
