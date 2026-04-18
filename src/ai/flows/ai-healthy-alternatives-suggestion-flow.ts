'use server';
/**
 * @fileOverview A Genkit flow for suggesting healthier food alternatives based on a scanned product and user profile.
 *
 * - aiHealthyAlternativesSuggestion - A function that suggests two healthier alternative products.
 * - AiHealthyAlternativesSuggestionInput - The input type for the aiHealthyAlternativesSuggestion function.
 * - AiHealthyAlternativesSuggestionOutput - The return type for the aiHealthyAlternativesSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHealthyAlternativesSuggestionInputSchema = z.object({
  scannedProductName: z
    .string()
    .describe('The name of the food product that was scanned.'),
  scannedProductSummary: z
    .string()
    .describe(
      'A brief summary of the scanned product\u0027s nutritional analysis, highlighting key nutritional issues (e.g., "high in sugar, low in fiber").'
    ),
  userProfile: z
    .object({
      age: z.number().optional().describe('The user\u0027s age.'),
      gender: z.string().optional().describe('The user\u0027s gender.'),
      activityLevel: z
        .string()
        .optional()
        .describe('The user\u0027s activity level (e.g., sedentary, sporty).'),
      healthGoals: z
        .array(z.string())
        .optional()
        .describe(
          'A list of the user\u0027s health goals (e.g., "lose weight", "gain muscle").'
        ),
      allergies: z
        .array(z.string())
        .optional()
        .describe('A list of the user\u0027s allergies (e.g., "gluten", "lactose").'),
      dietaryPreferences: z
        .array(z.string())
        .optional()
        .describe(
          'A list of the user\u0027s dietary preferences (e.g., "vegan", "vegetarian").'
        ),
    })
    .describe('The user\u0027s personalized profile information.'),
});
export type AiHealthyAlternativesSuggestionInput = z.infer<
  typeof AiHealthyAlternativesSuggestionInputSchema
>;

const AiHealthyAlternativesSuggestionOutputSchema = z.object({
  alternatives: z
    .array(
      z.object({
        name: z.string().describe('The name of the healthier alternative product.'),
        benefit: z
          .string()
          .describe('A concise statement explaining the benefit of this alternative.'),
      })
    )
    .length(2)
    .describe('An array containing exactly two healthier alternative product suggestions.'),
});
export type AiHealthyAlternativesSuggestionOutput = z.infer<
  typeof AiHealthyAlternativesSuggestionOutputSchema
>;

export async function aiHealthyAlternativesSuggestion(
  input: AiHealthyAlternativesSuggestionInput
): Promise<AiHealthyAlternativesSuggestionOutput> {
  return aiHealthyAlternativesSuggestionFlow(input);
}

const healthyAlternativesPrompt = ai.definePrompt({
  name: 'healthyAlternativesPrompt',
  input: {schema: AiHealthyAlternativesSuggestionInputSchema},
  output: {schema: AiHealthyAlternativesSuggestionOutputSchema},
  prompt: `Vous êtes un expert nutritionniste et vous proposez des alternatives alimentaires saines et personnalisées.

Étant donné les détails du produit scanné et les préférences alimentaires ainsi que les objectifs de santé de l'utilisateur, suggérez deux produits alternatifs plus sains et distincts.
Pour chaque alternative, fournissez son nom et un énoncé concis de son bénéfice, expliquant pourquoi c'est un meilleur choix compte tenu du profil de l'utilisateur.

Produit Scanné: {{{scannedProductName}}}
Résumé de ses problèmes nutritionnels: {{{scannedProductSummary}}}

Profil Utilisateur:
{{#if userProfile.age}}Âge: {{{userProfile.age}}}{{/if}}
{{#if userProfile.gender}}Sexe: {{{userProfile.gender}}}{{/if}}
{{#if userProfile.activityLevel}}Niveau d'activité: {{{userProfile.activityLevel}}}{{/if}}
{{#if userProfile.healthGoals}}Objectifs de santé: {{#each userProfile.healthGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if userProfile.allergies}}Allergies: {{#each userProfile.allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if userProfile.dietaryPreferences}}Préférences alimentaires: {{#each userProfile.dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Assurez-vous que les alternatives sont réellement plus saines et correspondent aux besoins spécifiques de l'utilisateur. Sortez exactement deux alternatives.`,
});

const aiHealthyAlternativesSuggestionFlow = ai.defineFlow(
  {
    name: 'aiHealthyAlternativesSuggestionFlow',
    inputSchema: AiHealthyAlternativesSuggestionInputSchema,
    outputSchema: AiHealthyAlternativesSuggestionOutputSchema,
  },
  async input => {
    const {output} = await healthyAlternativesPrompt(input);
    return output!;
  }
);
