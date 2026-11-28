import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowBlink } from '../../directives/arrow-blink';

/**
 * Link "Generate new recipe" with an arrow, in green text on a transparent background. It leads
 * back to the start of the recipe generator. Used on the recipe detail page and the cookbook.
 */
@Component({
  selector: 'app-new-recipe-link',
  imports: [RouterLink, ArrowBlink],
  templateUrl: './new-recipe-link.html',
  styleUrl: './new-recipe-link.scss',
})
export class NewRecipeLink {}
