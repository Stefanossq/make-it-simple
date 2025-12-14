import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Stars, SpotLight, PerspectiveCamera, MeshReflectorMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterData } from '../types';
import CharacterModel from './CharacterModel';
import { CAROUSEL_RADIUS, CAMERA_POSITION } from '../constants';

interface ExperienceProps {
  characters: CharacterData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const CarouselGroup: React.FC<ExperienceProps> = ({ characters, selectedIndex, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  useEffect(() => {
    const anglePerChar = (Math.PI * 2) / characters.length;
    targetRotation.current = -selectedIndex * anglePerChar;
  }, [selectedIndex, characters.length]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current,
        delta * 5
      );
    }
  });

  return (
    <group ref={groupRef}>
      {characters.map((char, index) => {
        const angle = (index * Math.PI * 2) / characters.length;
        const x = Math.sin(angle) * CAROUSEL_RADIUS;
        const z = Math.cos(angle) * CAROUSEL_RADIUS;
        
        return (
          <CharacterModel
            key={char.id}
            data={char}
            isActive={index === selectedIndex}
            position={[x, 0, z]}
            rotation={[0, angle, 0]} // Rotate character to face center (or camera depending on pref)
            onClick={() => onSelect(index)}
          />
        );
      })}
    </group>
  );
};

const Experience: React.FC<ExperienceProps> = (props) => {
  const activeColor = props.characters[props.selectedIndex].color;

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
      <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={40} />
      
      <color attach="background" args={['#050505']} />

      {/* Main Lighting Key */}
      <SpotLight
        position={[0, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        castShadow
        shadow-bias={-0.0001}
        color={activeColor}
      />
      
      {/* Fill Light */}
      <ambientLight intensity={0.4} />
      
      {/* Rim Light for depth */}
      <SpotLight
        position={[-5, 5, -5]}
        angle={0.5}
        intensity={1}
        color="cyan"
      />
       <SpotLight
        position={[5, 5, -5]}
        angle={0.5}
        intensity={1}
        color="purple"
      />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      
      <group position={[0, -1.5, 0]}>
        <CarouselGroup {...props} />
        
        {/* Reflective Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
            mirror={1} // Mirror 1 = perfect reflection
          />
        </mesh>
      </group>

      <Environment preset="city" blur={0.8} />
      <fog attach="fog" args={['#050505', 8, 25]} />
    </Canvas>
  );
};

export default Experience;