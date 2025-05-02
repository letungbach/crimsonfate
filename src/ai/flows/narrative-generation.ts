'use server';

/**
 * @fileOverview A narrative generation AI agent.
 *
 * - generateNarrative - A function that handles the narrative generation process.
 * - GenerateNarrativeInput - The input type for the generateNarrative function.
 * - GenerateNarrativeOutput - The return type for the generateNarrative function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateNarrativeInputSchema = z.object({
  playerActions: z.string().describe('A description of the player actions.'),
  inGameEvents: z.string().describe('A description of the in-game events.'),
});
export type GenerateNarrativeInput = z.infer<typeof GenerateNarrativeInputSchema>;

const GenerateNarrativeOutputSchema = z.object({
  narrative: z.string().describe('The generated narrative.'),
});
export type GenerateNarrativeOutput = z.infer<typeof GenerateNarrativeOutputSchema>;

export async function generateNarrative(input: GenerateNarrativeInput): Promise<GenerateNarrativeOutput> {
  return generateNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNarrativePrompt',
  input: {
    schema: z.object({
      playerActions: z.string().describe('A description of the player actions.'),
      inGameEvents: z.string().describe('A description of the in-game events.'),
    }),
  },
  output: {
    schema: z.object({
      narrative: z.string().describe('The generated narrative.'),
    }),
  },
  prompt: `You are a professional dungeon master that describes what is happening in the game.

  Description of player actions: {{{playerActions}}}
  Description of in-game events: {{{inGameEvents}}}

  Based on the above, generate a dark and immersive narrative of what is happening. Focus on making the player feel engaged with the world and its story.`,
});

const generateNarrativeFlow = ai.defineFlow<
  typeof GenerateNarrativeInputSchema,
  typeof GenerateNarrativeOutputSchema
>({
  name: 'generateNarrativeFlow',
  inputSchema: GenerateNarrativeInputSchema,
  outputSchema: GenerateNarrativeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
