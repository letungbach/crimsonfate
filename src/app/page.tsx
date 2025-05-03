
"use client";

import { useState } from 'react';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'; // Import SidebarProvider
import { CombatScreen } from '@/components/combat/combat-screen';
import { NarrativeDisplay } from '@/components/narrative/narrative-display';
import { CharacterManagementScreen } from '@/components/character/character-management-screen';
import type { GameState } from '@/types/game';
import { initialCryptEncounterState } from '@/ai/dev'; // Import the initial state
import { generateNarrative, GenerateNarrativeInput } from '@/ai/flows/narrative-generation'; // Import narrative generation
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function Home() {
  const [activeView, setActiveView] = useState('combat'); // Default to combat view
  const [gameState, setGameState] = useState<GameState>(initialCryptEncounterState);
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
  const { toast } = useToast();

  // Get the current active hero based on gameState (simplified)
  // In a real game, this would track whose turn it actually is.
  // For now, let's assume it's always the first hero if it's the player's turn.
  const activeHeroId = gameState.currentTurn === 'player' && gameState.party.length > 0 ? gameState.party[0].id : null;
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(gameState.party.length > 0 ? gameState.party[0].id : null);

   // Find the selected hero object
  const selectedHero = gameState.party.find(hero => hero.id === selectedHeroId);

  const handleAction = async (action: string, targetId?: string) => {
    console.log(`Action: ${action}, Target: ${targetId}`);
    // TODO: Implement full game logic
    const actingHeroName = gameState.party[0]?.name || 'Hero'; // Simple assumption

    // Basic narrative input
    const narrativeInput: GenerateNarrativeInput = {
      playerActions: `${actingHeroName} used ${action}${targetId ? ` on enemy ${targetId}` : ''}`,
      inGameEvents: "Combat action occurred", // Needs more detail later
    };

    // Rudimentary game state update (replace with actual logic)
    setGameState(prevState => ({
      ...prevState,
      // Keep existing narrative, new one will be added below
      // Simple turn switch example (needs proper turn order logic)
      currentTurn: prevState.currentTurn === 'player' ? 'enemy' : 'player',
      round: prevState.currentTurn === 'enemy' ? prevState.round + 1 : prevState.round,
      // Update player actions prompt
      playerActions: prevState.currentTurn === 'enemy' ? "Enemy is acting..." : `Choose an action for ${prevState.party[0]?.name || 'next hero'}`,
    }));

    // Generate narrative based on action
    setIsNarrativeLoading(true);
    try {
      const result = await generateNarrative(narrativeInput);
      setGameState(prevState => ({
        ...prevState,
        narrativeLog: [...prevState.narrativeLog, result.narrative],
      }));
    } catch (error) {
      console.error("Failed to generate narrative:", error);
      toast({
        title: "Narrative Error",
        description: "Could not generate the next part of the story.",
        variant: "destructive",
      });
       // Add a basic log entry even if AI fails
       setGameState(prevState => ({
        ...prevState,
        narrativeLog: [...prevState.narrativeLog, `(${narrativeInput.playerActions})`],
      }));
    } finally {
      setIsNarrativeLoading(false);
    }

    // Placeholder enemy turn simulation
    if (gameState.currentTurn === 'player') { // If it *was* player's turn, now it's enemy's
        // Simulate enemy action after a short delay
        setTimeout(async () => {
            const enemy = gameState.enemies[0]; // Assume first enemy acts
            const targetHero = gameState.party[Math.floor(Math.random() * gameState.party.length)]; // Target random hero
            const enemyAction = enemy.skills[0] || 'Basic Attack'; // Assume first skill

            const enemyNarrativeInput: GenerateNarrativeInput = {
              playerActions: "Enemy turn", // Placeholder
              inGameEvents: `${enemy.name} used ${enemyAction} on ${targetHero.name}`,
            };

             setGameState(prevState => ({
                ...prevState,
                // Update game state based on enemy action (e.g., reduce hero HP - NEEDS IMPLEMENTATION)
                // hp: targetHero.hp - enemy.attack, // Needs proper damage calculation
                playerActions: `Choose an action for ${prevState.party[0]?.name || 'next hero'}`, // Reset prompt
                currentTurn: 'player', // Switch back to player
             }));


            setIsNarrativeLoading(true);
            try {
              const result = await generateNarrative(enemyNarrativeInput);
              setGameState(prevState => ({
                ...prevState,
                narrativeLog: [...prevState.narrativeLog, result.narrative],
              }));
            } catch (error) {
                 console.error("Failed to generate enemy narrative:", error);
                 toast({
                    title: "Narrative Error",
                    description: "Could not generate the enemy's action description.",
                    variant: "destructive",
                  });
                 // Add a basic log entry even if AI fails
                 setGameState(prevState => ({
                    ...prevState,
                    narrativeLog: [...prevState.narrativeLog, `(${enemyNarrativeInput.inGameEvents})`],
                 }));
            } finally {
                setIsNarrativeLoading(false);
            }


        }, 1000); // 1 second delay for enemy turn
    }
  };

   const handleSelectHero = (heroId: string) => {
    setSelectedHeroId(heroId);
   };

   const handleUpgradeStat = (heroId: string, stat: 'hp' | 'stress' | 'skill') => {
     // TODO: Implement upgrade logic (e.g., check resources, update stats)
     toast({
       title: "Upgrade",
       description: `Upgrade ${stat} requested for hero ${heroId}. (Not implemented)`,
     });
     console.log(`Upgrade ${stat} for hero ${heroId}`);
   };

   const handleEquipItem = (heroId: string, itemId: string) => {
     // TODO: Implement item equipping logic
     toast({
       title: "Equip Item",
       description: `Equip item ${itemId} requested for hero ${heroId}. (Not implemented)`,
     });
     console.log(`Equip item ${itemId} for hero ${heroId}`);
   };


  const renderView = () => {
    switch (activeView) {
      case 'combat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <CombatScreen
                party={gameState.party}
                enemies={gameState.enemies}
                currentTurn={gameState.currentTurn}
                round={gameState.round}
                onAction={handleAction}
                activeHeroId={activeHeroId} // Pass the active hero ID
              />
            </div>
            <div className="mt-4">
              <NarrativeDisplay log={gameState.narrativeLog} isLoading={isNarrativeLoading} />
            </div>
          </div>
        );
      case 'narrative':
        // Display narrative log prominently when this view is active
        return <NarrativeDisplay log={gameState.narrativeLog} isLoading={isNarrativeLoading} />;
      case 'character':
        return (
          <CharacterManagementScreen
            heroes={gameState.party}
            onSelectHero={handleSelectHero}
            selectedHero={selectedHero} // Pass the selected hero object
            onUpgradeStat={handleUpgradeStat}
            onEquipItem={handleEquipItem} // Pass handler
          />
        );
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    // Wrap the entire layout with SidebarProvider
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
           {/* Add Sidebar items here */}
           {/* Example using Sidebar components */}
          <SidebarContent className="p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Combat View (B)"
                  isActive={activeView === 'combat'}
                  onClick={() => setActiveView('combat')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swords"><path d="m14.5 17.5 4-4-4-4"/><path d="m9.5 6.5-4 4 4 4"/><path d="m3 11.5 18 0"/><path d="m3 12.5 18 0"/></svg>
                   Combat
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <SidebarMenuButton
                    tooltip="Narrative Log"
                    isActive={activeView === 'narrative'}
                    onClick={() => setActiveView('narrative')}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h10v10a2 2 0 0 0 2 2Z"/><path d="M16 17h2"/><path d="M16 13h4"/><path d="M10 9h10"/></svg>
                   Narrative
                 </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                    tooltip="Character Management"
                    isActive={activeView === 'character'}
                    onClick={() => setActiveView('character')}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-12 0"/><circle cx="12" cy="8" r="5"/><path d="M20 17.5c0 2.5-3.58 5-8 5s-8-2.5-8-5"/></svg>
                   Characters
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
         </Sidebar>
        <main className="flex-1 p-4 md:p-6 overflow-auto"> {/* Adjusted padding */}
          {renderView()}
        </main>
      </div>
    </SidebarProvider>
  );
}
 
