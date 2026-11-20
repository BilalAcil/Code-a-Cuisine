import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/** How long the loading page is shown before it moves on to the results (milliseconds). */
const RESULTS_DELAY_MS = 8000;

/**
 * Loading page with an animated salad bowl, shown while the recipes are generated.
 * For now it moves on to the results page after a fixed delay; later this happens
 * when the answer of the n8n workflow arrives.
 */
@Component({
  selector: 'app-loading',
  imports: [RouterLink],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  constructor() {
    const router = inject(Router);
    const timer = setTimeout(() => router.navigate(['/results']), RESULTS_DELAY_MS);
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }
}
