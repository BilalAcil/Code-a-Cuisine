import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RecipeFormService } from '../services/recipe-form';

/**
 * Lets the user continue only when at least one ingredient was entered.
 * Otherwise the user is sent back to the ingredient step.
 */
export const ingredientsGuard: CanActivateFn = () => {
  const hasIngredients = inject(RecipeFormService).ingredients().length > 0;
  return hasIngredients || inject(Router).createUrlTree(['/generate']);
};
