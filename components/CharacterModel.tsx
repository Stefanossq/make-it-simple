import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Float, Sphere, RoundedBox, Cylinder, Sparkles, Ring } from '@react-three/drei';
import { CharacterData } from '../types';
import * as THREE from 'three';

interface CharacterModelProps {
  data: CharacterData;
  isActive: boolean;
  isConfirmed?: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

// --- Visual Effect Components ---

const SelectionRing = ({ color, isActive }: { color: string; isActive: boolean }) => {
    const ringRef = useRef<Mesh>(null);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (isActive) {
            setAnimating(true);
        } else {
            setAnimating(false);
            if(ringRef.current) {
                ringRef.current.scale.set(0, 0, 0);
                ringRef.current.material.opacity = 0;
            }
        }
    }, [isActive]);

    useFrame((_, delta) => {
        if (animating && ringRef.current) {
            ringRef.current.scale.lerp(new THREE.Vector3(2, 2, 2), delta * 5);
            const currentScale = ringRef.current.scale.x;
            const opacity = 1 - (currentScale / 2);
            (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity);
            if (currentScale >= 1.9) setAnimating(false);
        }
    });

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <Ring ref={ringRef} args={[0.4, 0.5, 32]} scale={[0,0,0]}>
                <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
            </Ring>
        </group>
    );
}

// --- Procedural Humanoid Components ---

const Humanoid = ({ 
  color, 
  isActive, 
  isHovered,
  isConfirmed,
  buildType = 'standard',
  flashIntensity = 0
}: { 
  color: string; 
  isActive: boolean;
  isHovered: boolean;
  isConfirmed: boolean;
  buildType?: 'heavy' | 'slim' | 'standard';
  flashIntensity: number;
}) => {
  
  const props = useMemo(() => {
    switch (buildType) {
      case 'heavy':
        return { torso: [0.6, 0.7, 0.4] as [number, number, number], shoulders: 0.8, armThick: 0.18, legThick: 0.2, headScale: 1.1, heightOffset: 0 };
      case 'slim':
        return { torso: [0.35, 0.6, 0.25] as [number, number, number], shoulders: 0.5, armThick: 0.1, legThick: 0.12, headScale: 0.95, heightOffset: 0.1 };
      case 'standard':
      default:
        return { torso: [0.45, 0.65, 0.3] as [number, number, number], shoulders: 0.6, armThick: 0.14, legThick: 0.16, headScale: 1, heightOffset: 0.05 };
    }
  }, [buildType]);

  const matColor = isActive ? color : "#555";
  const baseGlow = isActive ? 0.5 : (isHovered ? 0.3 : 0);
  
  // Ramps up intensity significantly when confirmed
  const confirmGlow = isConfirmed ? 5 : 0; 
  
  const totalEmissiveIntensity = baseGlow + flashIntensity * 2 + confirmGlow;
  const emissiveColor = isActive || isHovered ? color : "black";

  const suitMaterial = (
      <meshStandardMaterial 
        color={flashIntensity > 0.5 || isConfirmed ? "white" : "#222"} 
        metalness={0.6} 
        roughness={0.4} 
        emissive={emissiveColor}
        emissiveIntensity={flashIntensity + (isConfirmed ? 2 : 0)} 
      />
  );

  return (
    <group position={[0, props.heightOffset, 0]}>
      {/* Head */}
      <Sphere args={[0.22 * props.headScale, 32, 32]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={isConfirmed ? "white" : "#ffdbac"} emissive={isConfirmed ? color : "black"} emissiveIntensity={confirmGlow} metalness={0.1} roughness={0.8} />
      </Sphere>

      {/* Neck */}
      <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffdbac" metalness={0.1} roughness={0.8} />
      </Cylinder>

      {/* Torso */}
      <RoundedBox args={props.torso} radius={0.05} position={[0, 1.15, 0]}>
        {suitMaterial}
      </RoundedBox>
      
      {/* Chest Plate */}
      <RoundedBox args={[props.torso[0] * 0.8, props.torso[1] * 0.4, props.torso[2] + 0.02]} radius={0.02} position={[0, 1.3, 0]}>
         <meshStandardMaterial 
            color={flashIntensity > 0.5 ? "#fff" : matColor} 
            emissive={isActive || isHovered ? color : "white"} 
            emissiveIntensity={totalEmissiveIntensity} 
            metalness={0.8} 
            roughness={0.2} 
            toneMapped={false}
         />
      </RoundedBox>

      {/* Hips */}
      <RoundedBox args={[props.torso[0], 0.2, 0.3]} radius={0.05} position={[0, 0.75, 0]}>
        {suitMaterial}
      </RoundedBox>

      {/* Arms */}
      <group position={[-props.shoulders / 1.8, 1.35, 0]}>
        <Cylinder args={[props.armThick, props.armThick * 0.8, 0.7]} position={[0, -0.35, 0]}>
            {suitMaterial}
        </Cylinder>
        <Sphere args={[props.armThick]} position={[0, 0, 0]}>
             <meshStandardMaterial color={matColor} emissive={emissiveColor} emissiveIntensity={isActive ? 0.5 : (isHovered ? 0.3 : 0) + flashIntensity + confirmGlow} />
        </Sphere>
      </group>
      <group position={[props.shoulders / 1.8, 1.35, 0]}>
        <Cylinder args={[props.armThick, props.armThick * 0.8, 0.7]} position={[0, -0.35, 0]}>
             {suitMaterial}
        </Cylinder>
        <Sphere args={[props.armThick]} position={[0, 0, 0]}>
             <meshStandardMaterial color={matColor} emissive={emissiveColor} emissiveIntensity={isActive ? 0.5 : (isHovered ? 0.3 : 0) + flashIntensity + confirmGlow} />
        </Sphere>
      </group>

      {/* Legs */}
      <group position={[-props.torso[0] / 3, 0.65, 0]}>
        <Cylinder args={[props.legThick, props.legThick * 0.8, 0.75]} position={[0, -0.375, 0]}>
             {suitMaterial}
        </Cylinder>
      </group>
       <group position={[props.torso[0] / 3, 0.65, 0]}>
        <Cylinder args={[props.legThick, props.legThick * 0.8, 0.75]} position={[0, -0.375, 0]}>
             {suitMaterial}
        </Cylinder>
      </group>

      {/* Visor */}
      <mesh position={[0, 1.72, 0.18 * props.headScale]}>
         <boxGeometry args={[0.25 * props.headScale, 0.08, 0.1]} />
         <meshStandardMaterial 
            color={isActive ? "white" : "#111"} 
            emissive={isActive || isHovered ? color : "black"} 
            emissiveIntensity={(isActive ? 2 : (isHovered ? 1 : 0)) + flashIntensity * 5 + confirmGlow * 2} 
            toneMapped={false}
         />
      </mesh>
    </group>
  );
};

const TankHuman = (props: any) => (<Humanoid {...props} buildType="heavy" />);
const SpeedHuman = (props: any) => (<group rotation={[0.2, 0, 0]}><Humanoid {...props} buildType="slim" /></group>);
const MagicHuman = (props: any) => (
  <group>
    <Humanoid {...props} buildType="standard" />
    {props.isActive && (
       <Sparkles count={props.isConfirmed ? 100 : 30} scale={props.isConfirmed ? 4 : 2} size={props.isConfirmed ? 6 : 3} speed={props.isConfirmed ? 5 : 1} opacity={0.8} color={props.color} position={[0, 1, 0]} />
    )}
  </group>
);

// --- Main Component ---

const CharacterModel: React.FC<CharacterModelProps> = ({ data, isActive, isConfirmed = false, position, rotation, onClick }) => {
  const groupRef = useRef<Group>(null);
  const [flash, setFlash] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isActive) {
        setFlash(1);
    }
  }, [isActive]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isActive) {
           // Normal idle rotation
           groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + rotation[1];
           
           if (isConfirmed) {
             // Rapid spin and ascension during confirmation
             groupRef.current.rotation.y += state.clock.elapsedTime * 10;
             groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 1.5, delta * 2);
           }
      } else {
           groupRef.current.rotation.y = rotation[1];
      }
      
      const breatheSpeed = isActive ? 2 : 1;
      const height = isActive ? 0.5 : 0;
      
      // Don't fight the ascension lerp if confirmed
      if (!isConfirmed) {
          groupRef.current.position.y = THREE.MathUtils.lerp(
            groupRef.current.position.y,
            height + Math.sin(state.clock.elapsedTime * breatheSpeed) * 0.05,
            0.1
          );
      }

      const targetScale = isConfirmed ? 1.5 : (isActive ? 1.3 : (hovered ? 1.15 : 1));
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }

    if (flash > 0) setFlash(Math.max(0, flash - delta * 3));
  });

  const renderVisuals = () => {
    const props = { color: data.color, isActive, isHovered: hovered, isConfirmed, flashIntensity: flash };
    switch (data.role) {
      case 'Heavy Defender': return <TankHuman {...props} />;
      case 'Swift Scout': return <SpeedHuman {...props} />;
      case 'Arcane Weaver': return <MagicHuman {...props} />;
      default: return <Humanoid {...props} />;
    }
  };

  return (
    <group 
        ref={groupRef}
        position={position} 
        rotation={rotation}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <SelectionRing color={data.color} isActive={isActive} />
      
      <Float 
        speed={isActive ? 2 : 1} 
        rotationIntensity={isConfirmed ? 2 : 0} 
        floatIntensity={isConfirmed ? 2 : 0.2} 
        floatingRange={[-0.05, 0.05]}
      >
         {renderVisuals()}
      </Float>
    </group>
  );
};

export default CharacterModel;