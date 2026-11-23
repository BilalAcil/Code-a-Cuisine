import { Cuisine, Diet, TimeCategory } from '../models/recipe.models';

/** Time categories with their label and the hint shown below it. */
export const TIME_OPTIONS: readonly { value: TimeCategory; label: string; hint: string }[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20 min' },
  { value: 'medium', label: 'Medium', hint: '20-45 min' },
  { value: 'elaborate', label: 'Complex', hint: 'over 45 min' },
];

/** Cooking styles with their label. */
export const CUISINE_OPTIONS: readonly { value: Cuisine; label: string }[] = [
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'fusion', label: 'Fusion' },
];

/** Diets with their label. */
export const DIET_OPTIONS: readonly { value: Diet; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];
