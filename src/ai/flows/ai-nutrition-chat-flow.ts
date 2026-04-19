'use server';
/**
 * @fileOverview Flux Genkit pour discuter avec l'expert nutritionnel.
 * Optimisé pour des réponses ultra-concises et percutantes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionChatInputSchema = z.object({
  question: z.string().describe("La question de l'utilisateur"),
  context: z.string().optional().describe("Contexte optionnel (ex: dernier produit scanné)"),
});

const NutritionChatOutputSchema = z.object({
  answer: z.string().describe("La réponse de l'expert au format Markdown (style télégraphique et scientifique)"),
  keyTakeaways: z.array(z.string()).describe("Exactement 3 points clés ultra-courts de moins de 10 mots chacun"),
});
export type NutritionChatOutput = z.infer<typeof NutritionChatOutputSchema>;

export async function askNutritionExpert(question: string, context?: string): Promise<NutritionChatOutput> {
  return aiNutritionChatFlow({ question, context });
}

const nutritionChatPrompt = ai.definePrompt({
  name: 'nutritionChatPrompt',
  input: {schema: NutritionChatInputSchema},
  output: {schema: NutritionChatOutputSchema},
  prompt: `Vous êtes l'Expert Nutritionniste "Lanceur d'Alerte" de NutriScan Expert. 

### RÈGLES DE RÉPONSE CRITIQUES :
1. **CONCISION RADICALE** : Maximum 100 mots au total. Pas de fioritures.
2. **STYLE** : Scientifique, direct, presque militaire. 
3. **STRUCTURE VISUELLE** : Utilisez uniquement des listes à puces. Évitez les paragraphes longs.
4. **MARKDOWN** : Utilisez le gras pour les alertes et les molécules.
5. **PAS DE POLITESSE** : Ne dites ni "Bonjour", ni "C'est une excellente question". Allez droit à la vérité.

Question : {{{question}}}
Contexte : {{#if context}}{{{context}}}{{else}}Général{{/if}}

Sortez un JSON valide respectant NutritionChatOutputSchema.`,
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
