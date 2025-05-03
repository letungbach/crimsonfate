import { Hero, Enemy, GameState } from '../types/game';

// Define Heroes based on Chapter 1 & Story Context
export const seraphina: Hero = {
  id: 'hero-seraphina',
  name: 'Seraphina',
  class: 'Crusader',
  level: 1,
  hp: 30,
  maxHp: 30,
  stress: 0,
  maxStress: 100,
  skills: ['Smite', 'Bulwark'], // Based on Ch 7 & 12
  equippedItems: ['Basic Sword', 'Chainmail'], // Assuming basic armor
  avatarUrl: '/images/characters/crusader.png', // Placeholder path
};

export const kael: Hero = {
  id: 'hero-kael',
  name: 'Kael',
  class: 'Highwayman',
  level: 1,
  hp: 25,
  maxHp: 25,
  stress: 15, // Starts slightly stressed due to wary nature? Or gets stressed by Blight
  maxStress: 100,
  skills: ['Pistol Shot', 'Open Vein'], // Assuming basic skills + dagger use
  equippedItems: ['Flintlock', 'Dagger', 'Leather Jacket'], // Based on Ch 1 & 11
  avatarUrl: '/images/characters/highwayman.png', // Placeholder path
};

// Define Enemies based on Chapter 5 & Story Context
export const grotesque: Enemy = {
  id: 'enemy-grotesque-1',
  name: 'Grotesque',
  hp: 40,
  maxHp: 40,
  attack: 5, // Base attack if needed, main threat is Blight
  defense: 2,
  skills: ['Blight'], // Based on Ch 8
  imageUrl: '/images/enemies/grotesque.png', // Placeholder path
};

export const cultistAcolyte: Enemy = {
  id: 'enemy-acolyte-1',
  name: 'Cultist Acolyte',
  hp: 15,
  maxHp: 15,
  attack: 3,
  defense: 1,
  skills: ['Crude Strike'], // Basic attack
  imageUrl: '/images/enemies/cultist_acolyte.png', // Placeholder path
};

// Initial Game State for the Crypt Encounter (around Chapter 5)
export const initialCryptEncounterState: GameState = {
  party: [seraphina, kael],
  enemies: [grotesque, cultistAcolyte],
  currentTurn: 'player', // Heroes act first
  round: 1,
  narrativeLog: [
    "The flickering torchlight reveals a grim scene.",
    "A malformed figure, Grotesque, hunches over a crude altar, pulsing with green energy.",
    "A trembling Cultist Acolyte guards the entrance.",
  ],
  playerActions: "Choose an action for Seraphina.", // Example prompt
  inGameEvents: "Combat Start", // Example event
};

// Function to potentially update game state based on story events
// This is a placeholder for more complex logic later
export function processNarrativePoint(currentState: GameState, chapter: number): GameState {
  let newState = { ...currentState };
  switch (chapter) {
    case 5: // Interruption
      newState.narrativeLog.push("Seraphina steps into the chamber, sword ready. Kael follows, seeking shadows.");
      newState.narrativeLog.push("Grotesque continues his ritual. The Acolyte tenses.");
      newState.enemies = [grotesque, cultistAcolyte]; // Ensure enemies are set
      newState.inGameEvents = "EncounterTriggered";
      break;
    case 6: // The Tense Stand
       newState.narrativeLog.push("Seraphina: 'By the light, your evil ends here! Stand down!'");
       newState.narrativeLog.push("Kael melts into the shadows, dagger ready.");
       newState.playerActions = "Seraphina's turn. Choose Skill or Attack.";
       break;
    // Add cases for other chapters to simulate combat based on story beats
    // e.g., case 7 for Acolyte attack and Seraphina's Smite
    // e.g., case 8 & 9 for Grotesque's Blight on Kael
    // e.g., case 13 & 14 for Kael's shot and Seraphina's final Smite
    default:
      break;
  }
  return newState;
}
