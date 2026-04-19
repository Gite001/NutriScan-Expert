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
  prompt: `Vous êtes un expert Nutritionniste "Explorateur de Labyrinthes Moléculaires". Votre mission est de dénicher les trésors cachés et de révéler les pièges invisibles d'un produit.

### MISSIONS D'EXPLORATION :
1. **Chasse aux Trésors (Molecular Treasures)** : Identifiez des "pépites" nutritionnelles (ex: un acide gras spécifique, une synergie de vitamines, une biodisponibilité rare). Donnez-leur un grade de rareté (Commun, Rare, Légendaire).
2. **Filtre Radar "California Safety Act"** : Identifiez les additifs bannis que le radar a détectés.
3. **Analyse Calorique Contextuelle** : 
   - Estimez les calories selon le profil de l'utilisateur.
   - Déterminez la qualité des calories (Nutritives vs Vides).
4. **Secrets d'Experts 2026** : Révélez les marqueurs d'ultra-transformation ou les bienfaits métaboliques inattendus.

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Sexe: {{userProfile.sex}}, Niveau activité: {{userProfile.activityLevel}}, Objectifs: {{userProfile.healthGoals}}
{{else}}
  Utilisez un profil standard (Adulte, activité moyenne).
{{/if}}

Image: {{media url=photoDataUri}}

Sortez un JSON valide respectant NutriScanExpertOutputSchema. Soyez percutant et passionné dans vos descriptions.`,
});

const nutriScanExpertFlow = ai.defineFlow(
  {
    name: 'nutriScanExpertFlow',
    inputSchema: NutriScanExpertInputSchema,
    outputSchema: NutriScanExpertOutputSchema,
  },
  async (input) => {
    const { output } = await nutriScanExpertPrompt(input);
    if (!output) throw new Error("Analyse impossible. Veuillez assurer une meilleure visibilité du produit.");
    return output;
  }
);
