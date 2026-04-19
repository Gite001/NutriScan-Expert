'use server';
/**
 * @fileOverview Flux Genkit pour discuter avec l'expert nutritionnel.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionChatInputSchema = z.object({
  question: z.string().describe("La question de l'utilisateur"),
  context: z.string().optional().describe("Contexte optionnel (ex: dernier produit scanné)"),
});

const NutritionChatOutputSchema = z.object({
  answer: z.string().describe("La réponse de l'expert au format Markdown"),
  keyTakeaways: z.array(z.string()).describe("3 points clés à retenir"),
});
export type NutritionChatOutput = z.infer<typeof NutritionChatOutputSchema>;

export async function askNutritionExpert(question: string, context?: string): Promise<NutritionChatOutput> {
  return aiNutritionChatFlow({ question, context });
}

const nutritionChatPrompt = ai.definePrompt({
  name: 'nutritionChatPrompt',
  input: {schema: NutritionChatInputSchema},
  output: {schema: NutritionChatOutputSchema},
  prompt: `Vous êtes l'Expert Nutritionniste de NutriScan Expert. Votre ton est scientifique, pédagogique et engageant.

Question : {{{question}}}
Contexte : {{#if context}}{{{context}}}{{else}}Général{{/if}}

Répondez de manière structurée. Utilisez le Markdown pour la clarté.
Si la question est hors sujet (pas de nutrition, pas de santé, pas d'aliments), refusez poliment de répondre.
Intégrez toujours une perspective de "lanceur d'alerte" si pertinent.`,
});

const aiNutritionChatFlow = ai.defineFlow(
  {
    name: 'aiNutritionChatFlow',
    inputSchema: NutritionChatInputSchema,
    outputSchema: NutritionChatOutputSchema,
  },
  async (input) => {
    const {output} = await nutritionChatPrompt(input);
    if (!output) throw new Error("Erreur expert.");
    return output;
  }
);
