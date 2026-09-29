'use client'

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'

// 3D Rain Effect
function Rain() {
  const count = 1500
  const points = useRef(null)

  const particles = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30
      p[i * 3 + 1] = Math.random() * 20
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
    }
    return p
  }, [count])

  useFrame((state, delta) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        // Rain falls down and slightly diagonally
        positions[i * 3 + 1] -= delta * (15 + Math.random() * 5)
        positions[i * 3] -= delta * 2
        
        // Reset if it falls too low
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 15
          positions[i * 3] = (Math.random() - 0.5) * 30
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.4} sizeAttenuation={true} />
    </points>
  )
}

// Shattered Glass Shards (Noir Vibe)
function Shards() {
  const group = useRef(null)
  const { mouse } = useThree()
  
  useFrame((state, delta) => {
    // Spooky slow parallax effect
    const targetX = (mouse.x * 2)
    const targetY = (mouse.y * 2)
    
    if (group.current) {
      group.current.rotation.y += 0.05 * delta
      group.current.position.x += (targetX - group.current.position.x) * 0.02
      group.current.position.y += (targetY - group.current.position.y) * 0.02
    }
  })

  const shardsData = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15 - 5
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: [
        Math.random() * 1.5 + 0.5,
        Math.random() * 0.05 + 0.01, // Flat shards
        Math.random() * 2 + 1
      ]
    }))
  }, [])

  return (
    <group ref={group}>
      {shardsData.map((data, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={2} floatIntensity={1}>
          <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#ffffff" : "#1a1a1a"} 
              metalness={0.8} 
              roughness={0.2} 
              wireframe={i % 4 === 0} 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
      {/* Spider-Man Noir Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-lighten"
        style={{
          backgroundImage: 'url(/spiderman-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(120%)'
        }}
      />
      
      {/* Dark vignette gradient to make text readable and blend edges */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80 pointer-events-none" />
      
      <Canvas className="z-10" camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Harsh dramatic lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" />
        
        <Rain />
        <Shards />
        
        {/* Adds reflections for the glass shards */}
        <Environment preset="city" />
        
        {/* Noir Fog */}
        <fog attach="fog" args={['#0a0a0a', 5, 25]} />
      </Canvas>
    </div>
  )
}
