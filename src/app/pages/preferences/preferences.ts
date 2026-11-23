import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InfoDialog } from '../../components/info-dialog/info-dialog';
import { CUISINE_OPTIONS, DIET_OPTIONS, TIME_OPTIONS } from '../../data/preference-options';
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
  imports: [RouterLink, InfoDialog],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  /** Diets, cooking styles and time categories offered to the user. */
  protected readonly dietOptions = DIET_OPTIONS;
  protected readonly cuisineOptions = CUISINE_OPTIONS;
  protected readonly timeOptions = TIME_OPTIONS;

  protected readonly recipeForm = inject(RecipeFormService);
  private readonly router = inject(Router);

  /** True while the "not quite enough" pop-up is shown. */
  protected readonly showNotEnough = signal(false);
  protected readonly minPortions = MIN_PORTIONS;
  protected readonly maxPortions = MAX_PORTIONS;
  protected readonly minHelpers = MIN_HELPERS;
  protected readonly maxHelpers = MAX_HELPERS;

  /**
   * Starts the recipe generation and shows the loading page. If the ingredients are not enough
   * for the chosen portions, the pop-up is shown instead.
   */
  protected generate(): void {
    if (!this.recipeForm.hasEnoughIngredients()) {
      this.showNotEnough.set(true);
      return;
    }
    this.router.navigate(['/loading']);
  }

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
