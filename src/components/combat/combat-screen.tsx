
import type { FC } from 'react';
import type { Hero, Enemy } from '@/types/game';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Heart, Zap, Shield, Sword, Dices } from 'lucide-react'; // Icons for HP, Stress, Def, Atk, Skills

interface CombatScreenProps {
  party: Hero[];
  enemies: Enemy[];
  currentTurn: 'player' | 'enemy';
  round: number;
  onAction: (action: string, targetId?: string) => void; // Basic action handler
}

export const CombatScreen: FC<CombatScreenProps> = ({ party, enemies, currentTurn, round, onAction }) => {
  const activeCharacterId = currentTurn === 'player' ? party[0]?.id : enemies[0]?.id; // Simple turn logic placeholder

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Round {round}</h2>
        <p className="text-muted-foreground">{currentTurn === 'player' ? "Player's Turn" : "Enemy's Turn"}</p>
      </div>

      {/* Enemies Section */}
      <div className="flex justify-center space-x-4">
        {enemies.map((enemy) => (
          <Card key={enemy.id} className="w-48 text-center border-destructive bg-card/80 shadow-lg shadow-destructive/20">
            <CardHeader className="p-2">
              <CardTitle className="text-lg">{enemy.name}</CardTitle>
               <Image
                  src={enemy.imageUrl}
                  alt={enemy.name}
                  width={80}
                  height={80}
                  className="mx-auto my-2 object-contain"
                  data-ai-hint="monster creature"
                />
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <div className="flex items-center justify-center text-sm">
                <Heart className="w-4 h-4 mr-1 text-red-500" /> HP: {enemy.hp} / {enemy.maxHp}
              </div>
              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2" />
               {enemy.statusEffects && enemy.statusEffects.length > 0 && (
                 <div className="flex flex-wrap justify-center gap-1 mt-1">
                   {enemy.statusEffects.map(effect => <Badge key={effect} variant="destructive" className="text-xs">{effect}</Badge>)}
                 </div>
               )}
            </CardContent>
            <CardFooter className="p-2 flex justify-center">
               {currentTurn === 'player' && (
                 <Button variant="destructive" size="sm" onClick={() => onAction('attack', enemy.id)}>
                   <Sword className="mr-1" /> Attack
                 </Button>
               )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Party Section */}
      <div className="flex justify-center space-x-4">
        {party.map((hero) => (
          <Card key={hero.id} className={`w-48 text-center border-primary bg-card/90 shadow-lg shadow-primary/20 ${activeCharacterId === hero.id && currentTurn === 'player' ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="p-2">
              <CardTitle className="text-lg">{hero.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{hero.class}</p>
               <Image
                  src={hero.avatarUrl}
                  alt={hero.name}
                  width={80}
                  height={80}
                  className="mx-auto my-2 rounded-full border-2 border-primary"
                  data-ai-hint="fantasy character portrait"
                />
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <div className="flex items-center justify-center text-sm">
                 <Heart className="w-4 h-4 mr-1 text-red-500" /> HP: {hero.hp} / {hero.maxHp}
              </div>
              <Progress value={(hero.hp / hero.maxHp) * 100} className="h-2" />
              <div className="flex items-center justify-center text-sm">
                 <Zap className="w-4 h-4 mr-1 text-yellow-500" /> Stress: {hero.stress} / {hero.maxStress}
              </div>
              <Progress value={(hero.stress / hero.maxStress) * 100} className="h-2 [&>div]:bg-yellow-500" />
              {hero.statusEffects && hero.statusEffects.length > 0 && (
                 <div className="flex flex-wrap justify-center gap-1 mt-1">
                   {hero.statusEffects.map(effect => <Badge key={effect} variant="secondary" className="text-xs">{effect}</Badge>)}
                 </div>
               )}
            </CardContent>
             {currentTurn === 'player' && activeCharacterId === hero.id && (
                 <CardFooter className="p-2 flex flex-col space-y-1 items-center">
                    <p className="text-xs text-muted-foreground mb-1">Skills:</p>
                    {hero.skills.map(skill => (
                        <Button key={skill} variant="outline" size="sm" className="w-full" onClick={() => onAction(skill)}>
                            <Dices className="mr-1" /> {skill}
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
