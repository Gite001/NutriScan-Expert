/**
 * @fileOverview Schémas Zod partagés pour NutriScan Expert.
 * Ce fichier définit la structure des données pour l'analyse moléculaire et les trésors nutritionnels.
 */

import { z } from 'genkit';

export const UserProfileSchema = z.object({
  age: z.number().optional().describe("User's age"),
  sex: z.string().optional().describe("User's sex (e.g., 'male', 'female')"),
  activityLevel: z.string().optional().describe("User's activity level"),
  healthGoals: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
}).optional();

export const ScientificAlertSchema = z.object({
  title: z.string().describe("Titre de l'alerte (ex: 'Piège du Labyrinthe')"),
  message: z.string().describe("Détails scientifiques ou conseil de l'expert"),
  category: z.enum(['additif', 'glycemie', 'ultra-transformation', 'invisible', 'pesticide']),
});

export const QuickLookItemSchema = z.object({
  name: z.string(),
  level: z.enum(['Peu', 'Moyen', 'Beaucoup']),
  benefit: z.string(),
});

export const HealthyAlternativeSchema = z.object({
  productName: z.string(),
  benefit: z.string(),
});

export const MolecularTreasureSchema = z.object({
  name: z.string().describe("Nom de la pépite ou molécule précieuse dénichée"),
  description: z.string().describe("Pourquoi ce composant est un trésor pour le corps"),
  rarity: z.enum(['Commun', 'Rare', 'Légendaire']).describe("Niveau de rareté de ce bénéfice"),
});

export const NutriScanExpertOutputSchema = z.object({
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E']),
  globalScore: z.number().int().min(0).max(100),
  productName: z.string(),
  personalizationIndicator: z.string(),
  caloricAnalysis: z.object({
    caloriesPer100g: z.number(),
    estimatedPortion: z.string(),
    caloriesPerPortion: z.number(),
    dailyBudgetContribution: z.number(),
    qualityVerdict: z.enum(['Nutritives', 'Vides', 'Mixte']),
    expertAdvice: z.string(),
  }),
  molecularTreasures: z.array(MolecularTreasureSchema).max(3),
  scientificAlerts: z.array(ScientificAlertSchema).optional(),
  ecoIntelligence: z.object({
    ecoScore: z.number().int().min(0).max(100).describe("Score environnemental du produit"),
    planetaryVerdict: z.string().describe("Bref commentaire sur l'impact écologique"),
    footprintTags: z.array(z.string()).describe("Tags comme 'Local', 'Bio', 'Emballage Plastique', etc."),
  }),
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
