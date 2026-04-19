'use server';
/**
 * @fileOverview A Genkit flow for "NutriScan Expert" that recognizes food and generates a whistleblower-style nutritional analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { UserProfileSchema, NutriScanExpertOutputSchema, type NutriScanExpertOutput } from '../schemas';

const NutriScanExpertInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food product, as a data URI."
    ),
  userProfile: UserProfileSchema,
});
export type NutriScanExpertInput = z.infer<typeof NutriScanExpertInputSchema>;

export async function nutriScanExpert(input: NutriScanExpertInput): Promise<NutriScanExpertOutput> {
  return nutriScanExpertFlow(input);
}

const nutriScanExpertPrompt = ai.definePrompt({
  name: 'nutriScanExpertPrompt',
  input: { schema: NutriScanExpertInputSchema },
  output: { schema: NutriScanExpertOutputSchema },
  prompt: `Vous êtes un expert Nutritionniste "Lanceur d'Alerte" et Ingénieur en Biologie. Analysez le produit en image.

### MISSIONS CRITIQUES :
1. **Filtre "California Safety Act"** : Identifiez les additifs bannis (Rouge n°3, Bromate, etc.).
2. **Analyse Calorique Contextuelle** : 
   - Estimez les calories pour 100g et par portion logique.
   - Calculez l'impact sur le budget journalier de l'utilisateur (estimez ses besoins selon son profil : sédentaire ~2000kcal, actif ~2500kcal, etc.).
   - Déterminez si ce sont des "calories vides" (sucre/gras sans nutriments) ou "nutritives" (vitamines/fibres/protéines).
3. **Synergie Alimentaire** : Donnez un conseil sur comment équilibrer cet aliment avec le reste de la journée (ex: "ajoutez des fibres pour compenser l'index glycémique").
4. **Secrets d'Experts 2026** : Piège du sucre liquide, marqueurs d'ultra-transformation, risques invisibles.

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Sexe: {{userProfile.sex}}, Niveau activité: {{userProfile.activityLevel}}, Objectifs: {{userProfile.healthGoals}}
{{else}}
  Utilisez un profil standard (Adulte, activité moyenne).
{{/if}}

Image: {{media url=photoDataUri}}

Sortez un JSON valide respectant NutriScanExpertOutputSchema.`,
});

const nutriScanExpertFlow = ai.defineFlow(
  {
    name: 'nutriScanExpertFlow',
    inputSchema: NutriScanExpertInputSchema,
    outputSchema: NutriScanExpertOutputSchema,
  },
  async (input) => {
    const { output } = await nutriScanExpertPrompt(input);
    if (!output) throw new Error("Erreur analyse.");
    return output;
  }
);
