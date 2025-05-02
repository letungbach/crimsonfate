
import type { FC } from 'react';
import type { Hero } from '@/types/game';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { Heart, Zap, Star, ShieldPlus, Sword, Briefcase } from 'lucide-react'; // Icons for HP, Stress, Level, Upgrade, Skills, Items

interface CharacterManagementScreenProps {
  heroes: Hero[];
  onSelectHero: (heroId: string) => void; // Handler for when a hero card is clicked
  selectedHero?: Hero; // The currently selected hero for detailed view
  onUpgradeStat: (heroId: string, stat: 'hp' | 'stress' | 'skill') => void;
  onEquipItem: (heroId: string, itemId: string) => void;
}

export const CharacterManagementScreen: FC<CharacterManagementScreenProps> = ({
  heroes,
  onSelectHero,
  selectedHero,
  onUpgradeStat,
  onEquipItem,
}) => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hero Roster List */}
      <div className="md:col-span-1 space-y-2 h-[calc(100vh-4rem)] overflow-y-auto pr-2">
         <h2 className="text-xl font-bold text-primary mb-2">Your Heroes</h2>
         {heroes.length === 0 && <p className="text-muted-foreground">No heroes available.</p>}
        {heroes.map((hero) => (
          <Card
            key={hero.id}
            className={`cursor-pointer hover:border-primary transition-colors ${selectedHero?.id === hero.id ? 'border-primary border-2' : ''}`}
            onClick={() => onSelectHero(hero.id)}
          >
            <CardHeader className="flex flex-row items-center space-x-4 p-3">
               <Image
                  src={hero.avatarUrl}
                  alt={hero.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-primary"
                  data-ai-hint="fantasy character portrait"
                />
               <div>
                 <CardTitle className="text-base">{hero.name}</CardTitle>
                 <CardDescription className="text-xs">{hero.class} - Lvl {hero.level}</CardDescription>
               </div>
            </CardHeader>
             <CardContent className="p-3 pt-0 text-xs space-y-1">
                <div className="flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-red-500" /> HP: {hero.hp}/{hero.maxHp}
                </div>
                <Progress value={(hero.hp / hero.maxHp) * 100} className="h-1" />
                 <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" /> Stress: {hero.stress}/{hero.maxStress}
                </div>
                <Progress value={(hero.stress / hero.maxStress) * 100} className="h-1 [&>div]:bg-yellow-500" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Hero Details */}
      <div className="md:col-span-2">
        {selectedHero ? (
          <Card className="bg-card/90 shadow-lg">
            <CardHeader className="flex flex-row items-start space-x-4 p-4">
               <Image
                  src={selectedHero.avatarUrl}
                  alt={selectedHero.name}
                  width={100}
                  height={100}
                  className="rounded-lg border-2 border-primary"
                  data-ai-hint="fantasy character portrait large"
                />
               <div className="flex-1">
                 <CardTitle className="text-2xl">{selectedHero.name}</CardTitle>
                 <CardDescription className="text-sm">{selectedHero.class} - Level {selectedHero.level}</CardDescription>
                 <div className="mt-2 space-y-2">
                    <div className="flex items-center text-lg">
                        <Heart className="w-5 h-5 mr-2 text-red-500" /> HP: {selectedHero.hp} / {selectedHero.maxHp}
                    </div>
                    <Progress value={(selectedHero.hp / selectedHero.maxHp) * 100} className="h-3" />
                     <div className="flex items-center text-lg">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Stress: {selectedHero.stress} / {selectedHero.maxStress}
                    </div>
                    <Progress value={(selectedHero.stress / selectedHero.maxStress) * 100} className="h-3 [&>div]:bg-yellow-500" />
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skills */}
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><Sword className="mr-2"/> Skills</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedHero.skills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                     <Button size="sm" variant="outline" className="mt-2" onClick={() => onUpgradeStat(selectedHero.id, 'skill')}>
                        <ShieldPlus className="mr-1"/> Upgrade Skill
                     </Button>
                </div>
                 {/* Equipment */}
                 <div>
                     <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><Briefcase className="mr-2"/> Equipment</h3>
                     <ul className="list-disc list-inside space-y-1 text-sm">
                         {selectedHero.equippedItems.length > 0 ? selectedHero.equippedItems.map(item => <li key={item}>{item}</li>) : <li>None</li>}
                     </ul>
                     {/* Placeholder for item selection */}
                     <Button size="sm" variant="outline" className="mt-2" onClick={() => alert('Item equipping not implemented yet.')}>
                        <Briefcase className="mr-1"/> Equip Item
                     </Button>
                 </div>
            </CardContent>
             <CardFooter className="p-4 flex space-x-2">
                 <Button onClick={() => onUpgradeStat(selectedHero.id, 'hp')}>
                    <Heart className="mr-1"/> Upgrade HP
                 </Button>
                 <Button onClick={() => onUpgradeStat(selectedHero.id, 'stress')}>
                    <Zap className="mr-1"/> Upgrade Stress Cap
                 </Button>
             </CardFooter>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a hero to view details.
          </div>
        )}
      </div>
    </div>
  );
};
