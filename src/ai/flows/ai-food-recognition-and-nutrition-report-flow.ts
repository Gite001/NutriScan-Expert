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
  prompt: `Vous êtes l'Expert Nutritionniste "Explorateur de Labyrinthes Moléculaires". Vous recevez une image provenant du scanner SENSOR-X 2026.

### ANALYSE DE SPECTROSCOPIE VIRTUELLE :
L'image peut avoir été traitée par des capteurs HEAT (Infra-rouge) ou DARK (Basse lumière). Utilisez cette vision augmentée pour :
1. **DÉNICHER LES PÉPITES** : Identifiez 3 molécules ou bénéfices spécifiques (ex: antioxydants rares, polyphénols, enzymes actives).
2. **DÉJOUER LES PIÈGES** : Identifiez les alertes (additifs masqués, pics glycémiques potentiels, résidus de pesticides).
3. **SYMBIOSE PLANÉTAIRE** : Évaluez l'impact environnemental (origine, emballage, durabilité). Rappelez que manger propre nécessite un environnement propre.
4. **BONUS ALCHIMIE** : Proposez une "Recette Alchimique Express" et des astuces de Bio-Hacking (ex: "Consommez à 18°C pour préserver les enzymes").

### EXIGENCE ABSOLUE DE DONNÉES (MANDATOIRE) :
Vous DEVEZ remplir chaque champ du schéma NutriScanExpertOutputSchema. Si une donnée est incertaine, utilisez votre expertise pour fournir l'estimation la plus scientifiquement probable. Ne laissez AUCUN champ vide ou nul.
- Calculez l'analyse calorique (caloricAnalysis) avec précision.
- Déterminez le verdict de qualité (Nutritives, Vides ou Mixte).
- Fournissez l'ecoIntelligence complète avec le score et le verdict planétaire.

User Profile:
{{#if userProfile}}
  Âge: {{userProfile.age}}, Objectifs: {{userProfile.healthGoals}}, Allergies: {{userProfile.allergies}}
{{else}}
  Utilisez un profil standard.
{{/if}}

Image: {{media url=photoDataUri}}

### FORMAT DE SORTIE :
Sortez un JSON respectant strictement NutriScanExpertOutputSchema. Adoptez un ton passionné, scientifique et percutant. Chaque analyse doit donner l'impression d'une découverte majeure.`,
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
        throw new Error("L'Expert est très sollicité par d'autres expéditions. Réessayez dans quelques secondes.");
      }
      throw new Error("Le signal Sensor-X est trop faible. Merci de stabiliser l'appareil pour un scan moléculaire propre.");
    }
  }
);