export enum CharacterClass {
  TANK = 'Heavy Defender',
  SPEED = 'Swift Scout',
  MAGIC = 'Arcane Weaver'
}

export interface CharacterStats {
  power: number;
  speed: number;
  defense: number;
  utility: number;
}

export interface CharacterData {
  id: string;
  name: string;
  role: CharacterClass;
  description: string;
  color: string;
  stats: CharacterStats;
  geometry: 'box' | 'sphere' | 'torus';
}

export interface CarouselProps {
  characters: CharacterData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}