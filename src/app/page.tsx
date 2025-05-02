'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CombatScreen } from '@/components/combat/combat-screen';
import { CharacterManagementScreen } from '@/components/character/character-management-screen';
import { NarrativeDisplay } from '@/components/narrative/narrative-display';
import type { Hero, Enemy, GameState } from '@/types/game';
import { generateNarrative } from '@/ai/flows/narrative-generation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for initial state
const initialHeroes: Hero[] = [
  { id: 'hero1', name: 'Seraphina', class: 'Crusader', level: 1, hp: 30, maxHp: 30, stress: 10, maxStress: 100, skills: ['Smite', 'Bulwark'], equippedItems: ['Basic Sword', 'Chainmail'], avatarUrl: 'https://picsum.photos/seed/hero1/100/100', statusEffects: [] },
  { id: 'hero2', name: 'Kael', class: 'Highwayman', level: 1, hp: 25, maxHp: 25, stress: 20, maxStress: 100, skills: ['Pistol Shot', 'Open Vein'], equippedItems: ['Dagger', 'Flintlock'], avatarUrl: 'https://picsum.photos/seed/hero2/100/100', statusEffects: ['Bleeding'] },
  // Add more heroes if needed
];

const initialEnemies: Enemy[] = [
  { id: 'enemy1', name: 'Grotesque', hp: 40, maxHp: 40, attack: 8, defense: 2, skills: ['Blight', 'Rend'], imageUrl: 'https://picsum.photos/seed/enemy1/100/100', statusEffects: [] },
  { id: 'enemy2', name: 'Cultist Acolyte', hp: 20, maxHp: 20, attack: 5, defense: 0, skills: ['Stress Curse', 'Knife Jab'], imageUrl: 'https://picsum.photos/seed/enemy2/100/100', statusEffects: ['Weakened'] },
];

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'combat' | 'management'>('combat');
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
  const { toast } = useToast();

   // Initialize Game State
   useEffect(() => {
     setGameState({
       party: initialHeroes,
       enemies: initialEnemies,
       currentTurn: 'player',
       round: 1,
       narrativeLog: [],
       playerActions: "The adventure begins. The heroes step into the decaying crypt.",
       inGameEvents: "Dust motes dance in the slivers of light piercing the gloom. The air is heavy with the stench of decay.",
     });
   }, []);

  const updateNarrative = useCallback(async (playerActions: string, inGameEvents: string) => {
    if (!gameState) return;
    setIsLoadingNarrative(true);
    try {
      const result = await generateNarrative({ playerActions, inGameEvents });
      setGameState(prev => {
        if (!prev) return null;
        // Keep only the last N narratives (e.g., 10)
        const updatedLog = [...prev.narrativeLog, result.narrative].slice(-10);
        return { ...prev, narrativeLog: updatedLog, playerActions: "", inGameEvents: "" };
      });
    } catch (error) {
      console.error('Narrative generation failed:', error);
      toast({
        title: 'Narrative Error',
        description: 'Failed to generate narrative. Please try again.',
        variant: 'destructive',
      });
       // Add a fallback narrative
      setGameState(prev => {
        if (!prev) return null;
        const fallbackNarrative = `Error: Could not generate narrative. ${playerActions}. ${inGameEvents}`;
        const updatedLog = [...prev.narrativeLog, fallbackNarrative].slice(-10);
        return { ...prev, narrativeLog: updatedLog, playerActions: "", inGameEvents: "" };
      });
    } finally {
      setIsLoadingNarrative(false);
    }
  }, [gameState, toast]); // Add gameState and toast to dependencies

  // Trigger initial narrative generation
  useEffect(() => {
    if (gameState && gameState.narrativeLog.length === 0 && gameState.playerActions && gameState.inGameEvents) {
       updateNarrative(gameState.playerActions, gameState.inGameEvents);
    }
   }, [gameState, updateNarrative]); // Add updateNarrative


  const handleCombatAction = (action: string, targetId?: string) => {
    if (!gameState || gameState.currentTurn !== 'player') return;

    console.log(`Player action: ${action} on target ${targetId}`);
    // TODO: Implement actual combat logic (damage, status effects, etc.)

    // Example: Simple attack logic
    let playerActionDesc = "";
    let eventDesc = "";
    const actingHero = gameState.party[0]; // Simplification: always first hero acts

    if (action === 'attack' && targetId) {
       const targetEnemy = gameState.enemies.find(e => e.id === targetId);
       if (targetEnemy) {
         const damage = Math.max(1, 10 - targetEnemy.defense); // Placeholder damage
         targetEnemy.hp = Math.max(0, targetEnemy.hp - damage);
         playerActionDesc = `${actingHero.name} attacks ${targetEnemy.name} with ${actingHero.skills[0] || 'a basic attack'}.`;
         eventDesc = `${targetEnemy.name} takes ${damage} damage. ${targetEnemy.hp <= 0 ? `${targetEnemy.name} is slain!` : ''}`;

         // Remove defeated enemy
          if (targetEnemy.hp <= 0) {
             gameState.enemies = gameState.enemies.filter(e => e.id !== targetId);
         }
       }
    } else {
        // Handle other skills (placeholder)
        playerActionDesc = `${actingHero.name} uses ${action}.`;
        eventDesc = `The air crackles with energy.`; // Generic event description
    }


    // Switch turn to enemy (placeholder logic)
    const nextState: GameState = {
        ...gameState,
        currentTurn: 'enemy',
        playerActions: playerActionDesc,
        inGameEvents: eventDesc,
    };
    setGameState(nextState);
    updateNarrative(playerActionDesc, eventDesc);

    // Simulate enemy turn after a delay
    setTimeout(() => handleEnemyTurn(nextState), 1500);
  };

   const handleEnemyTurn = (currentState: GameState) => {
     if (currentState.currentTurn !== 'enemy' || currentState.enemies.length === 0) return;

     const actingEnemy = currentState.enemies[0]; // Simplification
     const targetHero = currentState.party[Math.floor(Math.random() * currentState.party.length)]; // Random target

     const damage = Math.max(1, actingEnemy.attack - 5); // Placeholder damage & hero defense
     targetHero.hp = Math.max(0, targetHero.hp - damage);

     const enemyActionDesc = `${actingEnemy.name} uses ${actingEnemy.skills[0] || 'a basic attack'} on ${targetHero.name}.`;
     const eventDesc = `${targetHero.name} takes ${damage} damage. ${targetHero.hp <= 0 ? `${targetHero.name} has fallen!` : ''}`;

     // TODO: Implement hero death logic

     // Switch turn back to player
     const nextRound = currentState.round + 1;
     const nextState: GameState = {
         ...currentState,
         currentTurn: 'player',
         round: nextRound,
         playerActions: enemyActionDesc,
         inGameEvents: eventDesc,
     };
     setGameState(nextState);
     updateNarrative(enemyActionDesc, eventDesc);
 };


  const handleSelectHero = (heroId: string) => {
    setSelectedHeroId(heroId);
  };

  const handleUpgradeStat = (heroId: string, stat: string) => {
     // TODO: Implement upgrade logic (cost resources, update stats)
     console.log(`Upgrade ${stat} for hero ${heroId}`);
      toast({
        title: "Upgrade",
        description: `Upgraded ${stat} for hero ${heroId}. (Placeholder)`,
      });

      setGameState(prev => {
        if (!prev) return null;
        const updatedParty = prev.party.map(hero => {
            if (hero.id === heroId) {
                if (stat === 'hp') return { ...hero, maxHp: hero.maxHp + 5, hp: hero.hp + 5 };
                if (stat === 'stress') return { ...hero, maxStress: hero.maxStress + 10 };
                 // Add more stat upgrades later
            }
            return hero;
        });
        return { ...prev, party: updatedParty };
      });
      // Update selected hero view if it matches
      if (selectedHeroId === heroId) {
          const updatedHero = gameState?.party.find(h => h.id === heroId);
          if (updatedHero) {
              // Trigger re-render by updating the ID (or the whole hero obj if state structure allows)
              setSelectedHeroId(null); // Force deselection
              setTimeout(() => setSelectedHeroId(heroId), 0); // Reselect to refresh
          }
      }
  };

  const handleEquipItem = (heroId: string, itemId: string) => {
     // TODO: Implement item equipping logic
     console.log(`Equip item ${itemId} for hero ${heroId}`);
      toast({
        title: "Equip Item",
        description: `Equipped item ${itemId} on hero ${heroId}. (Placeholder)`,
      });
  };

  if (!gameState) {
    // Loading state or initial setup display
    return (
      <div className="flex flex-col h-screen p-4">
         <Skeleton className="h-10 w-48 mb-4 self-center" /> {/* Tabs Skeleton */}
         <Skeleton className="h-48 mb-4" /> {/* Narrative Skeleton */}
         <Skeleton className="flex-1" /> {/* Main Content Skeleton */}
      </div>
    );
  }

  const selectedHero = gameState.party.find(hero => hero.id === selectedHeroId);

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
       <h1 className="text-3xl font-bold text-center text-primary font-medievalsharp">Crimson Fate</h1>

       <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'combat' | 'management')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="combat">Combat</TabsTrigger>
          <TabsTrigger value="management">Character Management</TabsTrigger>
        </TabsList>
        <TabsContent value="combat" className="flex-1 mt-0">
           {/* Narrative Display - Placed above combat */}
           <div className="mb-4">
             <NarrativeDisplay log={gameState.narrativeLog} isLoading={isLoadingNarrative} />
           </div>
           <CombatScreen
             party={gameState.party}
             enemies={gameState.enemies}
             currentTurn={gameState.currentTurn}
             round={gameState.round}
             onAction={handleCombatAction}
           />
        </TabsContent>
        <TabsContent value="management" className="flex-1 mt-0">
          <CharacterManagementScreen
            heroes={gameState.party}
            onSelectHero={handleSelectHero}
            selectedHero={selectedHero}
            onUpgradeStat={handleUpgradeStat}
            onEquipItem={handleEquipItem}
          />
        </TabsContent>
      </Tabs>


    </div>
  );
}
