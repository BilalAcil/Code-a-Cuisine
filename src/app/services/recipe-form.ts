import { Injectable, signal } from '@angular/core';
import { IngredientInput } from '../models/recipe.models';

/** Holds the user's input across all steps of the recipe generator. */
@Injectable({ providedIn: 'root' })
export class RecipeFormService {
  /** Ingredients entered so far. The most recently added one is first. */
  readonly ingredients = signal<IngredientInput[]>([]);

  /**
   * Adds an ingredient to the top of the list.
   * @param ingredient The ingredient to add.
   */
  addIngredient(ingredient: IngredientInput): void {
    this.ingredients.update((list) => [ingredient, ...list]);
  }

  /**
   * Removes the ingredient at the given position.
   * @param index Position in the list.
   */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }
}
