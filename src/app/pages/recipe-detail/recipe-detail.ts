import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DIET_OPTIONS, TIME_OPTIONS } from '../../data/preference-options';
import { RecipeFormService } from '../../services/recipe-form';

/** A chef label: name, icon (with its width in px) and background color. */
interface Chef {
  name: string;
  icon: string;
  iconWidth: number;
  color: string;
}

/** All chef labels. A recipe for two persons uses the first two, and so on. */
const CHEFS: Chef[] = [
  { name: 'Chef 1', icon: 'images/icon-chef-hat.png', iconWidth: 27.5, color: '#d7dfd7' },
  { name: 'Chef 2', icon: 'images/icon-chef-cutlery.png', iconWidth: 25, color: '#ffd9b3' },
  { name: 'Chef 3', icon: 'images/icon-chef-apron.png', iconWidth: 22, color: '#cfd7004d' },
  { name: 'Chef 4', icon: 'images/icon-chef-hat-2.png', iconWidth: 15, color: '#00800066' },
];

/**
 * Detail page of one recipe. The back link leads to the page the user came from:
 * the recipe results (default for recipes just generated) or the cookbook.
 */
@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly route = inject(ActivatedRoute);

  private readonly recipeForm = inject(RecipeFormService);

  /** Number of likes. Sample data for now. */
  protected readonly likes = 66;

  /** Chosen cooking time and diet as tags. The cuisine and "No preferences" are not shown. */
  protected readonly tags = computed(() => {
    const time = TIME_OPTIONS.find((option) => option.value === this.recipeForm.timeCategory())?.label;
    const diet = this.recipeForm.diet() === 'none'
      ? undefined
      : DIET_OPTIONS.find((option) => option.value === this.recipeForm.diet())?.label;
    return [diet, time].filter((label): label is string => !!label);
  });

  /** Nutrition values per portion. Sample data for now. */
  protected readonly nutrition = [
    { name: 'Energy', amount: '630 kcal' },
    { name: 'Protein', amount: '18g' },
    { name: 'Fat', amount: '24g' },
    { name: 'Carbs', amount: '58g' },
  ];

  /** The chefs who cook this recipe: as many as the user chose on the preferences page. */
  protected readonly chefs = computed(() => CHEFS.slice(0, this.recipeForm.helpers()));

  /** Where the user came from, taken from the query parameter `from` ("results" or "cookbook"). */
  private readonly origin = this.route.snapshot.queryParamMap.get('from');

  /** Target and text of the back link. */
  protected readonly back = computed(() =>
    this.origin === 'cookbook'
      ? { link: '/cookbook', label: 'Cookbook' }
      : { link: '/results', label: 'Recipe results' },
  );
}
