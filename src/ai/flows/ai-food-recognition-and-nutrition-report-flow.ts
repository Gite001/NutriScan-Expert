'use server';
/**
 * @fileOverview A Genkit flow for "NutriScan Expert" that recognizes food and generates a whistleblower-style nutritional analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const UserProfileSchema = z.object({
  age: z.number().optional().describe("User's age"),
  sex: z.string().optional().describe("User's sex (e.g., 'male', 'female')"),
  activityLevel: z.string().optional().describe("User's activity level"),
  healthGoals: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
}).optional();

const NutriScanExpertInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food product, as a data URI."
    ),
  userProfile: UserProfileSchema,
});
export type NutriScanExpertInput = z.infer<typeof NutriScanExpertInputSchema>;

// Output Schema
const ScientificAlertSchema = z.object({
  title: z.string().describe("Titre de l'alerte (ex: 'Alerte California Safety Act')"),
  message: z.string().describe("Détails scientifiques ou conseil de l'expert"),
  category: z.enum(['additif', 'glycemie', 'ultra-transformation', 'invisible', 'pesticide']),
});

const QuickLookItemSchema = z.object({
  name: z.string(),
  level: z.enum(['Peu', 'Moyen', 'Beaucoup']),
  benefit: z.string(),
});

const HealthyAlternativeSchema = z.object({
  productName: z.string(),
  benefit: z.string(),
});

const NutriScanExpertOutputSchema = z.object({
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E']),
  globalScore: z.number().int().min(0).max(100),
  productName: z.string(),
  personalizationIndicator: z.string(),
  mainAlert: z.string().optional(),
  scientificAlerts: z.array(ScientificAlertSchema).optional().describe("Alertes basées sur les controverses scientifiques 2025-2026"),
  quickLook: z.array(QuickLookItemSchema).min(4).max(4),
  healthyAlternatives: z.array(HealthyAlternativeSchema).min(2).max(2),
  expertVerdict: z.string(),
  bonusTips: z.object({
    practicalTips: z.array(z.string()).min(3).max(3),
    healthBenefits: z.array(z.string()).min(2).max(2),
    expressRecipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()).min(3).max(3),
    }),
  }),
});
export type NutriScanExpertOutput = z.infer<typeof NutriScanExpertOutputSchema>;

export async function nutriScanExpert(input: NutriScanExpertInput): Promise<NutriScanExpertOutput> {
  return nutriScanExpertFlow(input);
}

const nutriScanExpertPrompt = ai.definePrompt({
  name: 'nutriScanExpertPrompt',
  input: {schema: NutriScanExpertInputSchema},
  output: {schema: NutriScanExpertOutputSchema},
  prompt: `Vous êtes un expert Nutritionniste "Lanceur d'Alerte" et Product Manager. Analysez le produit en image avec une rigueur scientifique basée sur les dernières controverses de 2025-2026.

### MISSIONS CRITIQUES (Secrets d'Experts) :
1. **Filtre "California Safety Act"** : Identifiez les additifs bannis en Californie (Colorant Rouge n°3, Huile Végétale Bromée, Bromate de Potassium, etc.). Si présents, générez une alerte "ALERTE SCIENTIFIQUE".
2. **Piège du "Sucre Liquide"** : Pour les laits végétaux (avoine, amande), analysez le pic glycémique potentiel lié à la transformation de l'amidon en maltose, même si non écrit explicitement.
3. **Marqueurs d'Ultra-Transformation** : Traquez les gommes (xanthane, guar) et carraghénanes masquant des textures médiocres.
4. **Détection des Risques Invisibles** : 
   - Micro-plastiques pour les eaux en bouteille.
   - Métaux lourds pour les gros poissons (Thon/Espadon) ou chocolat noir (cadmium).
5. **Guide "Dirty Dozen" (Pesticides)** : Pour les fruits/légumes frais conventionnels de la liste noire (fraises, épinards, etc.), donnez une astuce de lavage optimale.

### STRUCTURE DU RAPPORT (En Français) :
- **productName** : Nom du produit.
- **scientificAlerts** : Liste des alertes basées sur les missions ci-dessus.
- **nutriScore** & **globalScore** : Évaluation honnête.
- **expertVerdict** : Un résumé percutant, comme un "quote" d'un expert engagé.

User Profile:
{{#if userProfile}}
  Age: {{userProfile.age}}, Sex: {{userProfile.sex}}, Goals: {{userProfile.healthGoals}}
{{else}}
  Analyse générale.
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
    const {output} = await nutriScanExpertPrompt(input);
    if (!output) throw new Error("Erreur analyse.");
    return output;
  }
);