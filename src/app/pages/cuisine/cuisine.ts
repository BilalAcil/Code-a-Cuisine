import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/** Header pictures of the cuisines. Cuisines without a picture show the plain heading. */
const HEADER_IMAGES: Record<string, string> = {
  italian: 'images/header-cuisine-italian.webp',
};

/** Page with the recipes of one cuisine (for example "Italian cuisine"), opened from the cookbook. */
@Component({
  selector: 'app-cuisine',
  imports: [RouterLink],
  templateUrl: './cuisine.html',
  styleUrl: './cuisine.scss',
})
export class Cuisine {
  /** The cuisine from the route, for example "italian". */
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('cuisine') ?? '';

  /** Heading of the page, for example "Italian cuisine". */
  protected readonly title = `${this.slug.charAt(0).toUpperCase()}${this.slug.slice(1)} cuisine`;

  /** CSS value of the header picture, or "none" when the cuisine has no picture yet. */
  protected readonly headerImage = HEADER_IMAGES[this.slug] ? `url('${HEADER_IMAGES[this.slug]}')` : 'none';

  /** Number of pages. Sample data for now. */
  protected readonly totalPages = 8;

  /** The page that is open. */
  protected readonly currentPage = signal(1);

  /**
   * Page numbers shown below the list: always five entries, with "..." for the pages in between,
   * for example 1 2 3 ... 8 at the start and 1 ... 5 ... 8 in the middle.
   */
  protected readonly pages = computed<(number | '...')[]>(() => {
    const current = this.currentPage();
    const total = this.totalPages;
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current, '...', total];
  });

  /** Opens the given page. */
  protected goTo(page: number): void {
    this.currentPage.set(Math.min(this.totalPages, Math.max(1, page)));
  }
}
