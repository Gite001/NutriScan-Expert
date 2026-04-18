'use server';
/**
 * @fileOverview A Genkit flow for "NutriScan Expert" that recognizes food from an image and generates a comprehensive, personalized nutritional analysis report.
 *
 * - nutriScanExpert - A function that handles the food recognition and nutritional analysis process.
 * - NutriScanExpertInput - The input type for the nutriScanExpert function.
 * - NutriScanExpertOutput - The return type for the nutriScanExpert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const UserProfileSchema = z.object({
  age: z.number().optional().describe("User's age"),
  sex: z.string().optional().describe("User's sex (e.g., 'male', 'female')"),
  activityLevel: z.string().optional().describe("User's activity level (e.g., 'sédentaire', 'sportif', etc.)"),
  healthGoals: z.array(z.string()).optional().describe("User's health goals (e.g., 'perte de poids', 'prise de masse musculaire')"),
  allergies: z.array(z.string()).optional().describe("User's allergies (e.g., 'gluten', 'produits laitiers')"),
  dietaryPreferences: z.array(z.string()).optional().describe("User's dietary preferences (e.g., 'végan', 'végétarien')"),
}).optional().describe("User's personalized profile information for tailored analysis.");

const NutriScanExpertInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The image should clearly show the product, ideally with a barcode and ingredient list if available."
    ),
  userProfile: UserProfileSchema,
});
export type NutriScanExpertInput = z.infer<typeof NutriScanExpertInputSchema>;

// Output Schema
const QuickLookItemSchema = z.object({
  name: z.string().describe("Name of the nutritional aspect (e.g., 'Protéines', 'Énergie')"),
  level: z.enum(['Peu', 'Moyen', 'Beaucoup']).describe("Level indicator ('Peu', 'Moyen', 'Beaucoup')"),
  benefit: z.string().describe("Benefit associated with this aspect (e.g., 'Essentiel pour les muscles')"),
});

const HealthyAlternativeSchema = z.object({
  productName: z.string().describe("Name of the healthier alternative product"),
  benefit: z.string().describe("Benefit of choosing this alternative"),
});

const ExpressRecipeSchema = z.object({
  name: z.string().describe("Name of the express recipe"),
  ingredients: z.array(z.string()).min(3).max(3).describe("List of 3 main ingredients for the recipe"),
});

const BonusTipsSchema = z.object({
  practicalTips: z.array(z.string()).min(3).max(3).describe("3 practical tips for consuming the product better"),
  healthBenefits: z.array(z.string()).min(2).max(2).describe("2 concrete health benefits related to the product"),
  expressRecipe: ExpressRecipeSchema.describe("A simple express recipe idea with 3 ingredients"),
});

const NutriScanExpertOutputSchema = z.object({
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E']).describe("Health score based on Nutri-Score system (A-E)"),
  globalScore: z.number().int().min(0).max(100).describe("Overall health score out of 100"),
  productName: z.string().describe("The name of the analyzed food product"),
  personalizationIndicator: z.string().describe("Message indicating if analysis is general or personalized (e.g., 'Analyse personnalisée pour un profil sportif')"),
  mainAlert: z.string().optional().describe("A visible warning if a major risk is detected (e.g., '⚠️ Riche en sucres !')"),
  quickLook: z.array(QuickLookItemSchema).min(4).max(4).describe("Quick view of 4 key nutritional aspects"),
  healthyAlternatives: z.array(HealthyAlternativeSchema).min(2).max(2).describe("Suggestion of 2 healthier replacement products"),
  expertVerdict: z.string().describe("A short, impactful summary from an expert's perspective"),
  bonusTips: BonusTipsSchema.describe("Section containing bonus tips, health benefits, and an express recipe"),
});
export type NutriScanExpertOutput = z.infer<typeof NutriScanExpertOutputSchema>;

export async function nutriScanExpert(input: NutriScanExpertInput): Promise<NutriScanExpertOutput> {
  return nutriScanExpertFlow(input);
}

const nutriScanExpertPrompt = ai.definePrompt({
  name: 'nutriScanExpertPrompt',
  input: {schema: NutriScanExpertInputSchema},
  output: {schema: NutriScanExpertOutputSchema},
  prompt: `You are an expert Product Manager and a seasoned Nutritionist. Your mission is to analyze a food product from an image and generate a comprehensive, personalized nutritional analysis report in French.

The analysis must be based on the provided image and, if available, the user's profile to offer a tailored perspective.

Here are the details for the report you need to generate:

1.  **Score Santé Principal:**
    *   **nutriScore**: Assign a Nutri-Score from A to E.
    *   **globalScore**: Assign a global health score out of 100.
2.  **Titre:** The name of the analyzed product. If not clearly visible, make a reasonable guess.
3.  **Indicateur de Personnalisation:** A clear message indicating if the analysis is general ("Analyse générale") or if it has been adjusted to the user's profile. If a user profile is provided, generate a message like "Analyse personnalisée pour un profil sportif" or "Analyse ajustée pour vos allergies (gluten)".
4.  **Alerte Principale:** If a major risk is detected (e.g., "Riche en sucres !", "Contient des allergènes"), display a prominent warning. If no major risk, this field can be omitted.
5.  **Section "D'un coup d'œil":** Provide a quick overview of 4 key nutritional aspects. For each, include its name (e.g., 'Protéines', 'Énergie', 'Matières grasses', 'Sucres'), a level indicator ('Peu', 'Moyen', 'Beaucoup'), and a short benefit/description.
6.  **Section "Alternatives Saines":** Suggest 2 healthier alternative products. For each alternative, provide its name and the specific benefit it offers over the scanned product. These alternatives should be general categories or types of food, not specific brands.
7.  **Le Verdict de l'Expert:** A concise and impactful summary in everyday language, like a quote from a nutritionist, giving an overall verdict on the product.
8.  **Section "Conseils Bonus":**
    *   **Astuces pratiques:** 3 practical tips on how to better consume or integrate this type of product into a healthy diet.
    *   **Bénéfices santé:** 2 concrete health benefits associated with the main components or type of food.
    *   **Recette express:** A simple recipe idea with 3 main ingredients, related to the product or its healthy consumption.

Use the following information for your analysis:

**User Profile:**
{{#if userProfile}}
  {{#if userProfile.age}}Age: {{userProfile.age}}
  {{/if}}{{#if userProfile.sex}}Sex: {{userProfile.sex}}
  {{/if}}{{#if userProfile.activityLevel}}Activity Level: {{userProfile.activityLevel}}
  {{/if}}{{#if userProfile.healthGoals}}Health Goals: {{#each userProfile.healthGoals}} - {{this}}{{/each}}
  {{/if}}{{#if userProfile.allergies}}Allergies: {{#each userProfile.allergies}} - {{this}}{{/each}}
  {{/if}}{{#if userProfile.dietaryPreferences}}Dietary Preferences: {{#each userProfile.dietaryPreferences}} - {{this}}{{/each}}
  {{/if}}
{{else}}
  No specific user profile provided, perform a general analysis.
{{/if}}

**Food Product Image:**
{{media url=photoDataUri}}

Ensure your response is a valid JSON object matching the `NutriScanExpertOutputSchema`. Focus on providing practical, easy-to-understand information. Output must be in French.
`,
});

const nutriScanExpertFlow = ai.defineFlow(
  {
    name: 'nutriScanExpertFlow',
    inputSchema: NutriScanExpertInputSchema,
    outputSchema: NutriScanExpertOutputSchema,
  },
  async (input) => {
    const {output} = await nutriScanExpertPrompt(input);
    if (!output) {
      throw new Error("Failed to generate a nutritional analysis report.");
    }
    return output;
  }
);
