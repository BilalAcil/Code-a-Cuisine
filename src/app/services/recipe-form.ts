import { Injectable, signal } from '@angular/core';
import { Cuisine, Diet, IngredientInput, TimeCategory } from '../models/recipe.models';

/** Holds the user's input across all steps of the recipe generator. */
@Injectable({ providedIn: 'root' })
export class RecipeFormService {
  /** Ingredients entered so far. The most recently added one is first. */
  readonly ingredients = signal<IngredientInput[]>([]);

  /** Number of portions, 1 to 12. */
  readonly portions = signal(2);

  /** Number of people who cook, 1 to 3. */
  readonly helpers = signal(1);

  /** Chosen time category, or null while nothing is chosen. */
  readonly timeCategory = signal<TimeCategory | null>(null);

  /** Chosen cooking style, or null while nothing is chosen. */
  readonly cuisine = signal<Cuisine | null>(null);

  /** Chosen diet, or null while nothing is chosen. */
  readonly diet = signal<Diet | null>(null);

  /**
   * Adds an ingredient to the top of the list.
   * @param ingredient The ingredient to add.
   */
  addIngredient(ingredient: IngredientInput): void {
    this.ingredients.update((list) => [ingredient, ...list]);
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
