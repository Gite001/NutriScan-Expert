/**
 * @fileOverview Schémas Zod partagés pour NutriScan Expert.
 * Ce fichier ne contient pas 'use server' pour pouvoir être exporté vers des composants clients ou serveurs.
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
  title: z.string().describe("Titre de l'alerte (ex: 'Alerte California Safety Act')"),
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

export const NutriScanExpertOutputSchema = z.object({
  nutriScore: z.enum(['A', 'B', 'C', 'D', 'E']),
  globalScore: z.number().int().min(0).max(100),
  productName: z.string(),
  personalizationIndicator: z.string(),
  caloricAnalysis: z.object({
    caloriesPer100g: z.number().describe("Calories pour 100g"),
    estimatedPortion: z.string().describe("Taille de portion estimée (ex: 200g, 1 unité)"),
    caloriesPerPortion: z.number().describe("Calories pour la portion estimée"),
    dailyBudgetContribution: z.number().describe("Pourcentage du budget journalier estimé pour cet utilisateur"),
    qualityVerdict: z.enum(['Nutritives', 'Vides', 'Mixte']).describe("Qualité des calories"),
    expertAdvice: z.string().describe("Conseil sur comment intégrer ces calories dans la journée"),
  }),
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
