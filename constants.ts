import { CharacterData, CharacterClass } from './types';

export const CHARACTERS: CharacterData[] = [
  {
    id: 'char_1',
    name: 'IRONCLAD',
    role: CharacterClass.TANK,
    description: 'A heavily armored supersolider. The bulwark against the darkness.',
    color: '#ff00ff',
    stats: { power: 90, speed: 20, defense: 100, utility: 30 },
    geometry: 'box'
  },
  {
    id: 'char_2',
    name: 'VIPER',
    role: CharacterClass.SPEED,
    description: 'An elite infiltrator with cybernetic reflex enhancers. Too fast to track.',
    color: '#00f3ff',
    stats: { power: 50, speed: 100, defense: 30, utility: 70 },
    geometry: 'sphere'
  },
  {
    id: 'char_3',
    name: 'MYSTIC',
    role: CharacterClass.MAGIC,
    description: 'A psionic operative capable of manipulating local energy fields.',
    color: '#eaff00',
    stats: { power: 95, speed: 45, defense: 40, utility: 90 },
    geometry: 'torus'
  }
];

// Lowered Y slightly to center the body mass, Z adjusted for framing
export const CAMERA_POSITION: [number, number, number] = [0, 0.8, 7.5];
export const CAROUSEL_RADIUS = 3.5;