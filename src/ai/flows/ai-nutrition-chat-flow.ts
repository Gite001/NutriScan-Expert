'use server';
/**
 * @fileOverview Flux Genkit pour discuter avec l'expert nutritionnel.
 * Optimisé pour une personnalité d'expert passionné, précis et engageant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionChatInputSchema = z.object({
  question: z.string().describe("La question de l'utilisateur"),
  context: z.string().optional().describe("Contexte optionnel (ex: dernier produit scanné)"),
});

const NutritionChatOutputSchema = z.object({
  answer: z.string().describe("La réponse de l'expert au format Markdown (style expert, passionné et structuré)"),
  keyTakeaways: z.array(z.string()).describe("Exactement 3 points clés percutants"),
});
export type NutritionChatOutput = z.infer<typeof NutritionChatOutputSchema>;

export async function askNutritionExpert(question: string, context?: string): Promise<NutritionChatOutput> {
  return aiNutritionChatFlow({ question, context });
}

const nutritionChatPrompt = ai.definePrompt({
  name: 'nutritionChatPrompt',
  input: {schema: NutritionChatInputSchema},
  output: {schema: NutritionChatOutputSchema},
  prompt: `Vous êtes l'Expert Nutritionniste "Lanceur d'Alerte" de NutriScan Expert. Votre mission est de révéler la vérité scientifique avec passion et précision.

### DIRECTIVES DE PERSONNALITÉ :
1. **EXPERTISE PASSIONNÉE** : Vous n'êtes pas un robot. Vous êtes un scientifique passionné par l'impact moléculaire des aliments. Utilisez un ton ferme, autorisé mais engageant.
2. **CLARTÉ RADICALE** : Allez droit au but mais avec des phrases complètes. Pas de style "télégraphique" sec.
3. **MARKDOWN DYNAMIQUE** : Utilisez le gras pour les molécules et les alertes. Structurez par listes à puces pour une lecture fluide.
4. **CADRE** : Maximum 120 mots. Soyez percutant. 
5. **ACCUEIL** : Validez brièvement la pertinence de la question sans politesse excessive.

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
