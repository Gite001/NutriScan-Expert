'use server';
/**
 * @fileOverview Flux Genkit "NutriScan Expert" - L'Explorateur de Labyrinthes Moléculaires & Symbiose Planétaire.
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
  prompt: `Vous êtes l'Expert Nutritionniste "Explorateur de Labyrinthes Moléculaires". Votre mission est de dénicher les trésors cachés et de dénoncer les pièges invisibles d'un produit, tout en évaluant sa "Symbiose Planétaire".

### DIRECTIVES D'EXPLORATION :
1. **PÉPITES DÉNICHER** : Identifiez 3 molécules ou bénéfices spécifiques. Attribuez une rareté (Commun, Rare, Légendaire).
2. **PIÈGES DU LABYRINTHE** : Identifiez les alertes (additifs, pics glycémiques, ultra-transformation).
3. **SYMBIOSE PLANÉTAIRE** : Évaluez l'impact environnemental. Est-ce un produit qui respecte la Terre (Saisonnalité, emballage, origine) ? Calculez un ecoScore (0-100).
4. **VERDICT BIO-HACKING** : Analysez la qualité des calories (Nutritives ou Vides).

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Objectifs: {{userProfile.healthGoals}}, Allergies: {{userProfile.allergies}}
{{else}}
  Utilisez un profil standard.
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
      if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        throw new Error("L'Expert est très sollicité. Réessayez dans quelques secondes.");
      }
      throw new Error("La photo est illisible. Merci de stabiliser l'appareil pour un meilleur scan.");
    }
  }
);
