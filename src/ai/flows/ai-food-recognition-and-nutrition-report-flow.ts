'use server';
/**
 * @fileOverview Flux Genkit "NutriScan Expert" - L'Explorateur de Labyrinthes Moléculaires.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { UserProfileSchema, NutriScanExpertOutputSchema, type NutriScanExpertOutput } from '../schemas';

const NutriScanExpertInputSchema = z.object({
  photoDataUri: z.string(),
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
  prompt: `Vous êtes l'Expert Nutritionniste "Explorateur de Labyrinthes Moléculaires". Votre mission est de dénicher les trésors cachés et de dénoncer les pièges invisibles d'un produit.

### DIRECTIVES D'EXPLORATION :
1. **PÉPITES DÉNICHER (Molecular Treasures)** : Identifiez 3 molécules ou bénéfices spécifiques. Attribuez-leur une rareté (Commun, Rare, Légendaire). Soyez précis (ex: "Acides gras Oméga-3 à haute biodisponibilité").
2. **PIÈGES DU LABYRINTHE** : Identifiez les alertes (additifs, pics glycémiques, marqueurs d'ultra-transformation).
3. **VERDICT BIO-HACKING** : Analysez la qualité des calories. Sont-elles "Nutritives" (riches en micronutriments) ou "Vides" ?
4. **SYNERGIE CELLULAIRE** : Expliquez comment ce produit interagit avec le métabolisme de l'utilisateur.

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Objectifs: {{userProfile.healthGoals}}, Allergies: {{userProfile.allergies}}
{{else}}
  Utilisez un profil standard (Adulte actif).
{{/if}}

Image: {{media url=photoDataUri}}

Sortez un JSON respectant strictement NutriScanExpertOutputSchema. Adoptez un ton passionné, scientifique et percutant.`,
});

const nutriScanExpertFlow = ai.defineFlow(
  {
    name: 'nutriScanExpertFlow',
    inputSchema: NutriScanExpertInputSchema,
    outputSchema: NutriScanExpertOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await nutriScanExpertPrompt(input);
      if (!output) throw new Error("Analyse impossible.");
      return output;
    } catch (error: any) {
      // Les erreurs de quota (429) ou de lecture sont gérées silencieusement pour l'utilisateur
      if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        throw new Error("L'Expert est très sollicité. Réessayez dans quelques secondes.");
      }
      throw new Error("La photo est illisible. Merci de stabiliser l'appareil pour un meilleur scan.");
    }
  }
);
