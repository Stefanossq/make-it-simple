import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Stars, SpotLight, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterData } from '../types';
import CharacterModel from './CharacterModel';
import { CAROUSEL_RADIUS, CAMERA_POSITION } from '../constants';

interface ExperienceProps {
  characters: CharacterData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  mode: 'selecting' | 'confirming' | 'game';
}

const CarouselGroup: React.FC<ExperienceProps> = ({ characters, selectedIndex, onSelect, mode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  useEffect(() => {
    const anglePerChar = (Math.PI * 2) / characters.length;
    targetRotation.current = -selectedIndex * anglePerChar;
  }, [selectedIndex, characters.length]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate faster if confirming for a dizzying effect, or keep locked
      const speed = mode === 'confirming' ? 2 : 5;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current,
        delta * speed
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
            isConfirmed={index === selectedIndex && mode === 'confirming'}
            position={[x, 0, z]}
            rotation={[0, angle, 0]} // Rotate character to face center
            onClick={() => mode === 'selecting' && onSelect(index)}
          />
        );
      })}
    </group>
  );
};

const Experience: React.FC<ExperienceProps> = (props) => {
  const activeColor = props.characters[props.selectedIndex].color;
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={CAMERA_POSITION} 
        fov={40} 
      />
      <CameraController mode={props.mode} />
      
      <color attach="background" args={['#050505']} />

      {/* Main Lighting Key */}
      <SpotLight
        position={[0, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={props.mode === 'confirming' ? 10 : 2} // Brighten on confirm
        castShadow
        shadow-bias={-0.0001}
        color={activeColor}
      />
      
      {/* Fill Light */}
      <ambientLight intensity={0.4} />
      
      {/* Rim Lights */}
      <SpotLight position={[-5, 5, -5]} angle={0.5} intensity={1} color="cyan" />
      <SpotLight position={[5, 5, -5]} angle={0.5} intensity={1} color="purple" />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      
      {/* Character Stage */}
      <group position={[0, -1.1, 0]}>
        <CarouselGroup {...props} />
        
        {/* Dynamic Soft Shadows */}
        <ContactShadows 
            opacity={0.6} 
            scale={20} 
            blur={2} 
            far={4} 
            resolution={256} 
            color="#000000" 
        />
        
        {/* Reflective Floor - fade out on confirm */}
        <group visible={props.mode !== 'confirming'}>
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
                mirror={1}
            />
            </mesh>
        </group>
      </group>

      <Environment preset="city" blur={0.8} />
      <fog attach="fog" args={['#050505', 5, 20]} />
    </Canvas>
  );
};

// Helper component to handle camera animation
const CameraController = ({ mode }: { mode: string }) => {
    useFrame((state, delta) => {
        // Target position based on mode
        // Normal: [0, 0.8, 7.5] (defined in constants)
        // Confirming: Zoom in close to [0, 1, 4.5] (Character is at Z~3.5, so this is 1 unit away)
        
        const targetPos = new THREE.Vector3(0, 0.8, 7.5);
        
        if (mode === 'confirming') {
            targetPos.set(0, 1.2, 4.2); // Close up on face/upper chest
        }

        // Smoothly interpolate current camera position to target
        state.camera.position.lerp(targetPos, delta * 2);
        
        // Add subtle shake if confirming
        if (mode === 'confirming') {
            state.camera.position.x += (Math.random() - 0.5) * 0.02;
            state.camera.position.y += (Math.random() - 0.5) * 0.02;
        }
    });
    return null;
}

export default Experience;