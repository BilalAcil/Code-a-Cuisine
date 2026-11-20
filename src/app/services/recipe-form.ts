import { Injectable, computed, signal } from '@angular/core';
import { Cuisine, Diet, IngredientInput, TimeCategory, Unit } from '../models/recipe.models';

/** Rough weight in grams of one unit of each ingredient unit (ml counts like g, a piece as 50 g). */
const GRAMS_PER_UNIT: Record<Unit, number> = {
  g: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  pcs: 50,
  tbsp: 15,
  tsp: 5,
  pinch: 1,
};

/** Largest allowed amount of one ingredient. */
const MAX_AMOUNT = 100000;

/** Minimum total amount of ingredients per portion, in grams. */
const MIN_GRAMS_PER_PORTION = 100;

/** Holds the user's input across all steps of the recipe generator. */
@Injectable({ providedIn: 'root' })
export class RecipeFormService {
  /** Ingredients entered so far. The most recently added one is first. */
  readonly ingredients = signal<IngredientInput[]>([]);

  /** Number of portions, 1 to 12. */
  readonly portions = signal(2);

  /** Number of people who cook, 1 to 3. */
  readonly helpers = signal(1);

  /**
   * True when the ingredients are enough for the chosen portions: at least 100 g per portion
   * (rough estimate). n8n checks the input again, this check only gives fast feedback.
   */
  readonly hasEnoughIngredients = computed(() => {
    const grams = this.ingredients().reduce((sum, item) => sum + item.amount * GRAMS_PER_UNIT[item.unit], 0);
    return grams >= this.portions() * MIN_GRAMS_PER_PORTION;
  });

  /** Chosen time category, or null while nothing is chosen. */
  readonly timeCategory = signal<TimeCategory | null>(null);

  /** Chosen cooking style, or null while nothing is chosen. */
  readonly cuisine = signal<Cuisine | null>(null);

  /** Chosen diet, or null while nothing is chosen. */
  readonly diet = signal<Diet | null>(null);

  /**
   * Adds an ingredient to the top of the list. If the same ingredient (same name, ignoring upper and
   * lower case) is already in the list with the same unit, the amounts are added together and the
   * entry moves to the top. With a different unit nothing changes.
   * @param ingredient The ingredient to add.
   * @returns 'added' for a new entry, 'merged' when the amount was added to an existing entry, or
   *   'unit-conflict' when the ingredient exists with a different unit.
   */
  addIngredient(ingredient: IngredientInput): 'added' | 'merged' | 'unit-conflict' {
    const key = ingredient.name.trim().toLowerCase();
    const list = this.ingredients();
    const index = list.findIndex((item) => item.name.trim().toLowerCase() === key);

    if (index === -1) {
      this.ingredients.set([ingredient, ...list]);
      return 'added';
    }
    const existing = list[index];
    if (existing.unit !== ingredient.unit) {
      return 'unit-conflict';
    }
    const amount = Math.min(MAX_AMOUNT, Math.round((existing.amount + ingredient.amount) * 100) / 100);
    this.ingredients.set([{ ...existing, amount }, ...list.filter((_, i) => i !== index)]);
    return 'merged';
  }

  /**
   * Replaces the ingredient at the given position.
   * @param index Position in the list.
   * @param ingredient The changed ingredient.
   */
  updateIngredient(index: number, ingredient: IngredientInput): void {
    this.ingredients.update((list) => list.map((item, i) => (i === index ? ingredient : item)));
  }

  /**
   * Removes the ingredient at the given position.
   * @param index Position in the list.
   */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }
}
