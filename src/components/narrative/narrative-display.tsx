
import type { FC } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface NarrativeDisplayProps {
  log: string[];
  isLoading: boolean;
}

export const NarrativeDisplay: FC<NarrativeDisplayProps> = ({ log, isLoading }) => {
  return (
    <Card className="h-48 flex flex-col">
      <CardHeader className="p-2 border-b">
        <CardTitle className="text-sm flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-primary" /> Narrative Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full p-3">
          {log.map((entry, index) => (
            <p key={index} className="text-sm mb-2 text-foreground/90">
              {entry}
            </p>
          ))}
          {isLoading && <p className="text-sm text-muted-foreground italic">Generating narrative...</p>}
          {log.length === 0 && !isLoading && <p className="text-sm text-muted-foreground italic">The story begins...</p>}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
