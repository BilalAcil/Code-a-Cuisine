/**
 * Shared data models for the Angular <-> n8n contract.
 * See docs/api-contract.md for the full specification.
 */

/** Allowed units for an ingredient amount. */
export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'pcs' | 'tbsp' | 'tsp' | 'pinch';

/** Time category selected by the user. */
export type TimeCategory = 'quick' | 'medium' | 'elaborate';

/** Cooking style selected by the user. */
export type Cuisine = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';

/** Dietary preference selected by the user. */
export type Diet = 'none' | 'vegetarian' | 'vegan' | 'keto';

/** An ingredient entered by the user. */
export interface IngredientInput {
  name: string;
  amount: number;
  unit: Unit;
}

/** Request body sent to the n8n `generate-recipes` webhook. */
export interface GenerateRequest {
  ingredients: IngredientInput[];
  /** Number of portions, 1 to 12. */
  portions: number;
  timeCategory: TimeCategory;
  cuisine: Cuisine;
  diet: Diet;
  /** Number of cooking helpers, 1 to 3. */
  helpers: number;
}

/** An ingredient inside a generated recipe. */
export interface RecipeIngredient extends IngredientInput {
  /** True if the user did not provide this ingredient. */
  missing: boolean;
}

/** A single cooking step. */
export interface RecipeStep {
  order: number;
  text: string;
  durationMinutes: number;
  /** Helper number (1 to helpers) responsible for this step. */
  helper: number;
  /** Label shared by steps that run in parallel, otherwise null. */
  parallelGroup: string | null;
  /** True for passive waiting time (oven, simmering) that other steps can overlap. */
  isWaiting: boolean;
}

/** Macronutrient values for one portion or the whole recipe. */
export interface NutritionValues {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

/** Nutrition information of a recipe. */
export interface Nutrition {
  perPortion: NutritionValues;
  total: NutritionValues;
}

/** A generated recipe. */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: Cuisine;
  diet: Diet;
  timeCategory: TimeCategory;
  totalMinutes: number;
  portions: number;
  helpers: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: Nutrition;
  /** ISO 8601 timestamp. */
  createdAt: string;
}

/** Quota information returned with every response. */
export interface QuotaInfo {
  remainingForIp: number;
  remainingGlobal: number;
  /** ISO 8601 timestamp when the daily quota resets. */
  resetsAt: string;
}

/** Successful response of the `generate-recipes` webhook. */
export interface GenerateSuccessResponse {
  status: 'ok';
  quota: QuotaInfo;
  /** Always exactly 3 recipes. */
  recipes: Recipe[];
}

/** Response of the `quota` webhook. */
export interface QuotaResponse {
  status: 'ok';
  quota: QuotaInfo;
}

/** Machine-readable error codes returned by n8n. */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'IP_QUOTA_EXCEEDED'
  | 'GLOBAL_QUOTA_EXCEEDED'
  | 'RATE_LIMITED'
  | 'AI_ERROR'
  | 'INTERNAL_ERROR';

/** Error response shared by all webhooks. */
export interface ApiErrorResponse {
  status: 'error';
  code: ApiErrorCode;
  message: string;
  /** Field-level problems for `VALIDATION_ERROR`. */
  details?: string[];
  quota?: QuotaInfo;
}

/** Union of all possible `generate-recipes` responses. */
export type GenerateResponse = GenerateSuccessResponse | ApiErrorResponse;
