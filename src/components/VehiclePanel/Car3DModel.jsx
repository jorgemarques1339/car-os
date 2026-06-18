import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useCarStore } from '../../store/useCarStore';

// Mockup of a Car using Three.js Primitives
function CarMockup() {
  const carRef = useRef();
  const wheelsRef = useRef([]);
  const { headlights, doorsLocked } = useCarStore();

  // Subtle breathing animation for the car and wheel rotation based on speed
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (carRef.current) {
      carRef.current.position.y = Math.sin(t) * 0.02;
    }
    
    // Ler a velocidade atual diretamente do store sem re-renderizar o React
    const currentSpeed = useCarStore.getState().speed;
    
    // Rotate wheels based on speed (convert km/h to rotation factor)
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += currentSpeed * 0.05;
      }
    });
  });

  return (
    <group ref={carRef}>
      {/* Car Body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.6, 3.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Cabin/Glass */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.3, 0.4, 1.8]} />
        <meshStandardMaterial color="#111" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Wheels */}
      <group ref={el => wheelsRef.current[0] = el} position={[-0.8, 0.2, 1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Rim / Spoke so we can see rotation */}
        <mesh position={[-0.11, 0, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.1]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>
      
      <group ref={el => wheelsRef.current[1] = el} position={[0.8, 0.2, 1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[0.11, 0, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.1]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

      <group ref={el => wheelsRef.current[2] = el} position={[-0.8, 0.2, -1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[-0.11, 0, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.1]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

      <group ref={el => wheelsRef.current[3] = el} position={[0.8, 0.2, -1.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[0.11, 0, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.1]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

      {/* Headlights Emissive */}
      <mesh position={[-0.5, 0.5, 1.76]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={headlights ? "#ffffff" : "#444444"} 
          emissive={headlights ? "#ffffff" : "#000000"} 
          emissiveIntensity={headlights ? 5 : 0} 
        />
      </mesh>
      <mesh position={[0.5, 0.5, 1.76]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial 
          color={headlights ? "#ffffff" : "#444444"} 
          emissive={headlights ? "#ffffff" : "#000000"} 
          emissiveIntensity={headlights ? 5 : 0} 
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.5, 0.5, -1.76]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={doorsLocked ? 0 : 2} />
      </mesh>
      <mesh position={[0.5, 0.5, -1.76]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={doorsLocked ? 0 : 2} />
      </mesh>
    </group>
  );
}

export default function Car3DModel() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Environment reflection for metal/glass materials */}
        <Environment preset="city" />
        
        {/* Soft shadow under the car */}
        <ContactShadows resolution={1024} scale={10} position={[0, 0, 0]} blur={2} opacity={0.5} far={1} color="#000000" />
        
        <CarMockup />
        
        {/* Controls to rotate the car */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
