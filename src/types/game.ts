
export type Hero = {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  stress: number;
  maxStress: number;
  skills: string[];
  equippedItems: string[];
  avatarUrl: string;
  statusEffects?: string[];
};

export type Enemy = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  skills: string[];
  imageUrl: string;
  statusEffects?: string[];
};

export type GameState = {
  party: Hero[];
  enemies: Enemy[];
  currentTurn: 'player' | 'enemy';
  round: number;
  narrativeLog: string[];
  playerActions: string;
  inGameEvents: string;
};
