'use server';
/**
 * @fileOverview Flux Genkit pour analyser un produit par son nom uniquement.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NutriScanExpertOutputSchema, type NutriScanExpertOutput } from '../schemas';

const FoodSearchInputSchema = z.object({
  productName: z.string().describe("Le nom du produit à rechercher"),
  userProfile: z.any().optional(),
});
export type FoodSearchInput = z.infer<typeof FoodSearchInputSchema>;

export async function aiFoodSearch(input: FoodSearchInput): Promise<NutriScanExpertOutput> {
  return aiFoodSearchFlow(input);
}

const foodSearchPrompt = ai.definePrompt({
  name: 'foodSearchPrompt',
  input: { schema: FoodSearchInputSchema },
  output: { schema: NutriScanExpertOutputSchema },
  prompt: `Vous êtes un expert Nutritionniste "Lanceur d'Alerte". L'utilisateur n'a pas de photo mais recherche un produit par son nom : "{{{productName}}}".

### MISSION :
1. Identifiez le produit le plus probable correspondant à ce nom (marque ou type générique).
2. Effectuez l'analyse complète comme si vous aviez l'étiquette sous les yeux.
3. Appliquez le filtre "California Safety Act" et les "Secrets d'Experts 2026".
4. Calculez l'impact calorique selon le profil utilisateur fourni.

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Sexe: {{userProfile.sex}}, Niveau activité: {{userProfile.activityLevel}}
{{else}}
  Utilisez un profil standard.
{{/if}}

Sortez un JSON valide respectant NutriScanExpertOutputSchema.`,
});

const aiFoodSearchFlow = ai.defineFlow(
  {
    name: 'aiFoodSearchFlow',
    inputSchema: FoodSearchInputSchema,
    outputSchema: NutriScanExpertOutputSchema,
  },
  async (input) => {
    const { output } = await foodSearchPrompt(input);
    if (!output) throw new Error("Erreur recherche.");
    return output;
  }
);
