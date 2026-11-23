import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowBlink } from '../../directives/arrow-blink';
import { CUISINE_OPTIONS, DIET_OPTIONS, TIME_OPTIONS } from '../../data/preference-options';
import { RecipeFormService } from '../../services/recipe-form';

/** Page with the three generated recipes. */
@Component({
  selector: 'app-results',
  imports: [RouterLink, ArrowBlink],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly recipeForm = inject(RecipeFormService);

  /** The three recipe cards. Sample data for now; the recipes will come from the n8n workflow. */
  protected readonly cards = [
    { label: 'Recipe 1', title: 'Pasta with spinach and cherry tomatoes', minutes: 20 },
    { label: 'Recipe 2', title: 'Creamy garlic shrimp pasta', minutes: 22 },
    { label: 'Recipe 3', title: 'Pasta alla Trapanese (Sicilian Tomato Pesto)', minutes: 20 },
  ];

  /**
   * Labels of the chosen cooking style, time and diet, shown as pills below the introduction.
   * "No preferences" is not shown because it gives the user no information.
   */
  protected readonly choices = computed(() => {
    const cuisine = CUISINE_OPTIONS.find((option) => option.value === this.recipeForm.cuisine())?.label;
    const time = TIME_OPTIONS.find((option) => option.value === this.recipeForm.timeCategory())?.label;
    const diet = this.recipeForm.diet() === 'none'
      ? undefined
      : DIET_OPTIONS.find((option) => option.value === this.recipeForm.diet())?.label;
    return [cuisine, time, diet].filter((label): label is string => !!label);
  });
}
