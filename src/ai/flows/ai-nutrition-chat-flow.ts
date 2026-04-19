
'use server';
/**
 * @fileOverview Flux Genkit pour discuter avec l'expert nutritionnel.
 * Optimisé pour des réponses concises et structurées.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionChatInputSchema = z.object({
  question: z.string().describe("La question de l'utilisateur"),
  context: z.string().optional().describe("Contexte optionnel (ex: dernier produit scanné)"),
});

const NutritionChatOutputSchema = z.object({
  answer: z.string().describe("La réponse de l'expert au format Markdown (concise et structurée)"),
  keyTakeaways: z.array(z.string()).describe("Exactement 3 points clés ultra-courts"),
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
1. **CONCISION ABSOLUE** : Ne dépassez jamais 3 paragraphes courts. Allez droit au but.
2. **STRUCTURE VISUELLE** : Utilisez des listes à puces pour les faits. Pas de longs blocs de texte.
3. **TON** : Direct, scientifique et révélateur. Pas de formules de politesse inutiles.
4. **MARKDOWN** : Utilisez du gras pour les termes techniques et les alertes.
5. **CONTEXTE** : Si le contexte est fourni, liez votre réponse à l'aliment spécifique.

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
