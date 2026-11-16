import { Unit } from '../models/recipe.models';

/** Common ingredients offered by the autocomplete in the ingredient input. */
export const INGREDIENT_SUGGESTIONS: readonly string[] = [
  'Apple', 'Asparagus', 'Avocado', 'Baby spinach', 'Bacon', 'Banana', 'Basil', 'Beef', 'Bell pepper',
  'Black beans', 'Bread', 'Broccoli', 'Butter', 'Cabbage', 'Carrot', 'Cauliflower', 'Celery',
  'Cheddar', 'Cheese', 'Cherry tomatoes', 'Chicken breast', 'Chickpeas', 'Chili', 'Cilantro',
  'Coconut milk', 'Cream', 'Cucumber', 'Egg', 'Eggplant', 'Feta', 'Flour', 'Garlic', 'Ginger',
  'Ground beef', 'Ham', 'Honey', 'Lemon', 'Lentils', 'Lettuce', 'Lime', 'Milk', 'Mozzarella',
  'Mushrooms', 'Mustard', 'Noodles', 'Oats', 'Olive oil', 'Onion', 'Parmesan', 'Parsley', 'Pasta',
  'Passion fruit', 'Pastrami', 'Peas', 'Pork', 'Potato', 'Rice', 'Salmon', 'Salt', 'Sausage', 'Soy sauce',
  'Spinach', 'Spring onion', 'Sugar', 'Sweet potato', 'Tofu', 'Tomato', 'Tomato paste', 'Tuna',
  'Turkey', 'Yogurt', 'Zucchini',
];

/** A unit with the label shown in the dropdown. */
export interface UnitOption {
  value: Unit;
  label: string;
}

/** Units offered in the dropdown. Values match the API contract. */
export const UNIT_OPTIONS: readonly UnitOption[] = [
  { value: 'pcs', label: 'piece' },
  { value: 'ml', label: 'ml' },
  { value: 'g', label: 'gram' },
];
