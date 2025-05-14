
import type { FC } from 'react';
import type { Hero, Enemy } from '@/types/game';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
// Removed Lucide icons for HP/Stress/Skills as we'll use emojis
// Keep Sword for generic attack button if needed
import { Sword } from 'lucide-react';

interface CombatScreenProps {
  party: Hero[];
  enemies: Enemy[];
  currentTurn: 'player' | 'enemy';
  round: number;
  onAction: (action: string, targetId?: string) => void;
  activeHeroId: string | null; // Added to highlight active hero
}

// Helper to get emoji for skill
const getSkillEmoji = (skillName: string): string => {
  switch (skillName) {
    case 'Smite': return '✨';
    case 'Bulwark': return '🛡️';
    case 'Pistol Shot': return '🔫';
    case 'Open Vein': return '🩸'; // Kael's assumed dagger skill
    case 'Blight': return '☠️';
    case 'Crude Strike': return '🗡️';
    default: return '⚔️'; // Default combat icon
  }
};

export const CombatScreen: FC<CombatScreenProps> = ({ party, enemies, currentTurn, round, onAction, activeHeroId }) => {

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">⚔️ Round {round} ⚔️</h2>
        {/* Turn Indicator with Emojis */}
        <p className="text-muted-foreground text-lg">
           {currentTurn === 'player' ? "🦸 Player's Turn" : "👹 Enemy's Turn"}
        </p>
      </div>

      {/* Enemies Section */}
      <div className="flex justify-center space-x-4">
        {enemies.map((enemy) => (
          <Card key={enemy.id} className="w-48 text-center border-destructive bg-card/80 shadow-lg shadow-destructive/20">
            <CardHeader className="p-2">
              {/* Enemy Name with Emoji */}
              <CardTitle className="text-lg">{enemy.name === 'Grotesque' ? '👹' : '👤'} {enemy.name}</CardTitle>
               <Image
                  src={enemy.imageUrl}
                  alt={enemy.name}
                  width={80}
                  height={80}
                  className="mx-auto my-2 object-contain"
                />
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {/* HP with Emoji */}
              <div className="flex items-center justify-center text-sm">
                 ❤️ HP: {enemy.hp} / {enemy.maxHp}
              </div>
              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2 [&>div]:bg-red-600" />
               {enemy.statusEffects && enemy.statusEffects.length > 0 && (
                 <div className="flex flex-wrap justify-center gap-1 mt-1">
                   {enemy.statusEffects.map(effect => (
                       <Badge key={effect} variant="destructive" className="text-xs">{effect}</Badge> // Effect text now includes emoji
                   ))}
                 </div>
               )}
            </CardContent>
            <CardFooter className="p-2 flex justify-center">
               {currentTurn === 'player' && enemy.hp > 0 && (
                 <Button variant="destructive" size="sm" onClick={() => onAction('attack', enemy.id)}>
                   <Sword className="w-4 h-4 mr-1" /> Attack
                 </Button>
               )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Divider or Space */}
       <hr className="border-dashed border-muted-foreground my-6" />

      {/* Party Section */}
      <div className="flex justify-center space-x-4">
        {party.map((hero) => (
          <Card key={hero.id} className={`w-48 text-center border-primary bg-card/90 shadow-lg shadow-primary/20 transition-all ${activeHeroId === hero.id && currentTurn === 'player' && hero.hp > 0 ? 'ring-4 ring-offset-2 ring-primary ring-offset-background scale-105' : 'opacity-80'}`}>
            <CardHeader className="p-2">
              <CardTitle className="text-lg">{hero.name === 'Seraphina' ? '🛡️' : '🤠'} {hero.name}</CardTitle>
              <p className="text-xs text-muted-foreground">Lvl {hero.level} {hero.class}</p>
               <Image
                  src={hero.avatarUrl}
                  alt={hero.name}
                  width={80}
                  height={80}
                  className={`mx-auto my-2 rounded-full border-2 ${activeHeroId === hero.id && currentTurn === 'player' && hero.hp > 0 ? 'border-amber-400' : 'border-primary'}`}
                />
            </CardHeader>
            <CardContent className="p-2 space-y-1">
               {/* HP with Emoji */}
              <div className="flex items-center justify-center text-sm">
                 ❤️ HP: {hero.hp} / {hero.maxHp}
              </div>
              <Progress value={(hero.hp / hero.maxHp) * 100} className="h-2 [&>div]:bg-red-500" />
               {/* Stress with Emoji */}
              <div className="flex items-center justify-center text-sm mt-1">
                 😨 Stress: {hero.stress} / {hero.maxStress}
              </div>
              <Progress value={(hero.stress / hero.maxStress) * 100} className="h-2 [&>div]:bg-yellow-500" />
              {hero.statusEffects && hero.statusEffects.length > 0 && (
                 <div className="flex flex-wrap justify-center gap-1 mt-1">
                   {hero.statusEffects.map(effect => (
                        // Status effect text includes emoji from applyStatusEffect
                       <Badge key={effect} variant="secondary" className="text-xs bg-purple-700 text-white">{effect}</Badge>
                   ))}
                 </div>
               )}
                 {/* Display Defeated Status */}
                 {hero.hp <= 0 && (
                      <Badge variant="destructive" className="mt-2 text-lg font-bold w-full justify-center">💀 DEFEATED 💀</Badge>
                 )}
            </CardContent>
             {currentTurn === 'player' && activeHeroId === hero.id && hero.hp > 0 && (
                 <CardFooter className="p-2 flex flex-col space-y-1 items-center">
                    <p className="text-xs text-muted-foreground mb-1">Skills:</p>
                    {hero.skills.map(skill => (
                        <Button key={skill} variant="outline" size="sm" className="w-full" onClick={() => onAction(skill)}>
                           {/* Skill Emoji + Name */}
                           {getSkillEmoji(skill)} {skill}
                        </Button>
                    ))}
                 </CardFooter>
             )}
          </Card>
        ))}
      </div>
    </div>
  );
};
