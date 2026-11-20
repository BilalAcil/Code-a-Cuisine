import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cuisine, Diet, TimeCategory } from '../../models/recipe.models';
import { RecipeFormService } from '../../services/recipe-form';

/** Smallest and largest allowed number of portions. */
const MIN_PORTIONS = 1;
const MAX_PORTIONS = 12;

/** Smallest and largest allowed number of helpers. */
const MIN_HELPERS = 1;
const MAX_HELPERS = 3;

/** Step 2 of the generator: the user chooses portions, helpers, time, cuisine and diet. */
@Component({
  selector: 'app-preferences',
  imports: [RouterLink],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  /** Diets offered to the user. */
  protected readonly dietOptions: readonly { value: Diet; label: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'none', label: 'No preferences' },
  ];

  /** Cooking styles offered to the user. */
  protected readonly cuisineOptions: readonly { value: Cuisine; label: string }[] = [
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'indian', label: 'Indian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'gourmet', label: 'Gourmet' },
    { value: 'fusion', label: 'Fusion' },
  ];

  /** Time categories offered to the user. */
  protected readonly timeOptions: readonly { value: TimeCategory; label: string; hint: string }[] = [
    { value: 'quick', label: 'Quick', hint: 'up to 20 min' },
    { value: 'medium', label: 'Medium', hint: '20-45 min' },
    { value: 'elaborate', label: 'Complex', hint: 'over 45 min' },
  ];

  protected readonly recipeForm = inject(RecipeFormService);
  protected readonly minPortions = MIN_PORTIONS;
  protected readonly maxPortions = MAX_PORTIONS;
  protected readonly minHelpers = MIN_HELPERS;
  protected readonly maxHelpers = MAX_HELPERS;

  /**
   * Changes the number of portions by the given step, within the allowed range.
   * @param step +1 or -1.
   */
  protected changePortions(step: number): void {
    this.recipeForm.portions.update((value) => Math.min(MAX_PORTIONS, Math.max(MIN_PORTIONS, value + step)));
  }

  /**
   * Changes the number of helpers by the given step, within the allowed range.
   * @param step +1 or -1.
   */
  protected changeHelpers(step: number): void {
    this.recipeForm.helpers.update((value) => Math.min(MAX_HELPERS, Math.max(MIN_HELPERS, value + step)));
  }
}
