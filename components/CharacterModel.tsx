import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Float, Sphere, RoundedBox, Cylinder, Sparkles } from '@react-three/drei';
import { CharacterData } from '../types';
import * as THREE from 'three';

interface CharacterModelProps {
  data: CharacterData;
  isActive: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

// --- Procedural Humanoid Components ---

const Humanoid = ({ 
  color, 
  isActive, 
  buildType = 'standard' // 'heavy', 'slim', 'standard'
}: { 
  color: string; 
  isActive: boolean;
  buildType?: 'heavy' | 'slim' | 'standard';
}) => {
  
  // Define proportions based on build type
  const props = useMemo(() => {
    switch (buildType) {
      case 'heavy':
        return {
          torso: [0.6, 0.7, 0.4] as [number, number, number],
          shoulders: 0.8,
          armThick: 0.18,
          legThick: 0.2,
          headScale: 1.1,
          heightOffset: 0
        };
      case 'slim':
        return {
          torso: [0.35, 0.6, 0.25] as [number, number, number],
          shoulders: 0.5,
          armThick: 0.1,
          legThick: 0.12,
          headScale: 0.95,
          heightOffset: 0.1
        };
      case 'standard':
      default:
        return {
          torso: [0.45, 0.65, 0.3] as [number, number, number],
          shoulders: 0.6,
          armThick: 0.14,
          legThick: 0.16,
          headScale: 1,
          heightOffset: 0.05
        };
    }
  }, [buildType]);

  const matColor = isActive ? color : "#555";
  const glowIntensity = isActive ? 0.5 : 0;

  return (
    <group position={[0, props.heightOffset, 0]}>
      {/* Head */}
      <Sphere args={[0.22 * props.headScale, 32, 32]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#ffdbac" metalness={0.1} roughness={0.8} />
      </Sphere>

      {/* Neck */}
      <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffdbac" metalness={0.1} roughness={0.8} />
      </Cylinder>

      {/* Torso (Suit) */}
      <RoundedBox args={props.torso} radius={0.05} position={[0, 1.15, 0]}>
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      
      {/* Chest Plate / Armor Highlight */}
      <RoundedBox args={[props.torso[0] * 0.8, props.torso[1] * 0.4, props.torso[2] + 0.02]} radius={0.02} position={[0, 1.3, 0]}>
         <meshStandardMaterial color={matColor} emissive={color} emissiveIntensity={glowIntensity} metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Hips */}
      <RoundedBox args={[props.torso[0], 0.2, 0.3]} radius={0.05} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>

      {/* Arms */}
      <group position={[-props.shoulders / 1.8, 1.35, 0]}>
        {/* Left Arm */}
        <Cylinder args={[props.armThick, props.armThick * 0.8, 0.7]} position={[0, -0.35, 0]}>
            <meshStandardMaterial color="#333" />
        </Cylinder>
        <Sphere args={[props.armThick]} position={[0, 0, 0]}>
             <meshStandardMaterial color={matColor} />
        </Sphere>
      </group>
      <group position={[props.shoulders / 1.8, 1.35, 0]}>
        {/* Right Arm */}
        <Cylinder args={[props.armThick, props.armThick * 0.8, 0.7]} position={[0, -0.35, 0]}>
             <meshStandardMaterial color="#333" />
        </Cylinder>
        <Sphere args={[props.armThick]} position={[0, 0, 0]}>
             <meshStandardMaterial color={matColor} />
        </Sphere>
      </group>

      {/* Legs */}
      <group position={[-props.torso[0] / 3, 0.65, 0]}>
        {/* Left Leg */}
        <Cylinder args={[props.legThick, props.legThick * 0.8, 0.75]} position={[0, -0.375, 0]}>
             <meshStandardMaterial color="#222" />
        </Cylinder>
      </group>
       <group position={[props.torso[0] / 3, 0.65, 0]}>
        {/* Right Leg */}
        <Cylinder args={[props.legThick, props.legThick * 0.8, 0.75]} position={[0, -0.375, 0]}>
             <meshStandardMaterial color="#222" />
        </Cylinder>
      </group>

      {/* Visor / Eyes */}
      <mesh position={[0, 1.72, 0.18 * props.headScale]}>
         <boxGeometry args={[0.25 * props.headScale, 0.08, 0.1]} />
         <meshStandardMaterial color={isActive ? "white" : "#111"} emissive={isActive ? color : "black"} emissiveIntensity={isActive ? 2 : 0} />
      </mesh>
    </group>
  );
};

// --- Specific Character Wrappers ---

const TankHuman = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <Humanoid color={color} isActive={isActive} buildType="heavy" />
);

const SpeedHuman = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <group rotation={[0.2, 0, 0]}> {/* Lean forward */}
    <Humanoid color={color} isActive={isActive} buildType="slim" />
  </group>
);

const MagicHuman = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <group>
    <Humanoid color={color} isActive={isActive} buildType="standard" />
    {isActive && (
       <Sparkles count={30} scale={2} size={3} speed={1} opacity={0.8} color={color} position={[0, 1, 0]} />
    )}
  </group>
);

// --- Main Component ---

const CharacterModel: React.FC<CharacterModelProps> = ({ data, isActive, position, rotation, onClick }) => {
  const groupRef = useRef<Group>(null);
  
  // Animate the group
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle idle rotation
      if (isActive) {
           groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + rotation[1];
      } else {
           groupRef.current.rotation.y = rotation[1];
      }
      
      // Breathing / Floating animation
      const breatheSpeed = isActive ? 2 : 1;
      const height = isActive ? 0.5 : 0;
      
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        height + Math.sin(state.clock.elapsedTime * breatheSpeed) * 0.05,
        0.1
      );
    }
  });

  // Render specific character based on ID/Role
  const renderVisuals = () => {
    switch (data.role) {
      case 'Heavy Defender':
        return <TankHuman color={data.color} isActive={isActive} />;
      case 'Swift Scout':
        return <SpeedHuman color={data.color} isActive={isActive} />;
      case 'Arcane Weaver':
        return <MagicHuman color={data.color} isActive={isActive} />;
      default:
        return <Humanoid color={data.color} isActive={isActive} />;
    }
  };

  const activeScale = isActive ? 1.3 : 1;

  return (
    <group 
        ref={groupRef}
        position={position} 
        rotation={rotation}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        scale={[activeScale, activeScale, activeScale]}
    >
      <Float 
        speed={isActive ? 2 : 1} 
        rotationIntensity={0} // Don't rotate whole body randomly, keeps them standing
        floatIntensity={0.2} 
        floatingRange={[-0.05, 0.05]}
      >
         {renderVisuals()}
      </Float>
      
      {/* Simple shadow blob */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} position-y={0.01}>
         <circleGeometry args={[0.6, 32]} />
         <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

export default CharacterModel;