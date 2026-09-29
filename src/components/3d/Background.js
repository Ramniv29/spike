'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'

function FloatingObjects() {
  const group = useRef()
  const { mouse } = useThree()

  useFrame((state, delta) => {
    // Parallax effect based on mouse
    const targetX = (mouse.x * 2)
    const targetY = (mouse.y * 2)
    
    if (group.current) {
      group.current.rotation.y += 0.2 * delta
      group.current.position.x += (targetX - group.current.position.x) * 0.05
      group.current.position.y += (targetY - group.current.position.y) * 0.05
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3, 1, -5]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#71717a" wireframe />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[4, -1, -6]}>
          <torusGeometry args={[1.5, 0.2, 16, 100]} />
          <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[0, 2, -10]}>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#52525b" wireframe />
        </mesh>
      </Float>
    </group>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#121212]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingObjects />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
