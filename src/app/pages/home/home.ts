import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeFormService } from '../../services/recipe-form';

/**
 * Landing page with the hero section. Links to the generator and the cookbook.
 * Opening it (for example with the logo on any page) starts over: the ingredients and
 * preferences chosen before are cleared.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor() {
    inject(RecipeFormService).reset();
  }

  /** Plate images shown in the hero column. Plates 4 and 5 only appear on widescreen. */
  protected readonly plates = [1, 2, 3, 4, 5];

  /** Counts arrow animations. Its parity selects the CSS class, so every change restarts the animation. */
  protected readonly arrowBlinks = signal(0);

  /** Replays the cookbook arrow animation. Called when the pointer enters and when it leaves the link. */
  protected blinkArrow(): void {
    this.arrowBlinks.update((count) => count + 1);
  }
}
