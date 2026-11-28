import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AutoHideScrollbar } from '../../directives/auto-hide-scrollbar';
import { DIET_OPTIONS, TIME_OPTIONS } from '../../data/preference-options';
import { RecipeFormService } from '../../services/recipe-form';

/** One cooking step: number, title, the chef who does it and the instruction text. */
interface Step {
  number: number;
  title: string;
  chef: number;
  text: string;
}

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
  imports: [RouterLink, AutoHideScrollbar],
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

  /** Ingredients the user has. Sample data for now. */
  protected readonly yourIngredients = [
    { amount: '80g', name: 'Pasta noodles' },
    { amount: '100g', name: 'Baby spinach' },
    { amount: '150g', name: 'Cherry tomatoes' },
    { amount: '1 piece', name: 'Egg' },
    { amount: '2 pieces', name: 'Garlic cloves' },
    { amount: '1 piece', name: 'Red onion' },
    { amount: '50g', name: 'Pine nuts' },
  ];

  /** Extra ingredients the user has to add. Sample data for now. */
  protected readonly extraIngredients = [
    { amount: '40g', name: 'Parmesan cheese' },
    { amount: '30ml', name: 'Olive oil' },
    { amount: '1 tsp', name: 'Chili flakes' },
    { amount: '1 pinch', name: 'Salt' },
    { amount: '1 pinch', name: 'Black pepper' },
    { amount: '', name: 'Herbs (dry basil, oregano, garlic)' },
  ];

  /** Cooking steps. Sample data for now. */
  private readonly steps: Step[] = [
    { number: 1, title: 'Cook the pasta', chef: 1, text: 'Cook your noodles in boiling, salted water, until the pasta is al dente. Drain the pasta and reserve some of the pasta water.' },
    { number: 2, title: 'Make the sauce', chef: 2, text: 'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and sauté until it starts to turn golden. Add the tomatoes, oregano, salt, and pepper, and cook for 3-4 minutes.' },
    { number: 3, title: 'Finish the pasta', chef: 1, text: 'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes, and parmesan.' },
    { number: 4, title: 'Make the sauce', chef: 2, text: 'Lower the heat to low, stir until mixed, and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.' },
    { number: 5, title: 'Serve the pasta', chef: 1, text: 'Divide the pasta between two plates, pour the remaining sauce on top, and sprinkle with fresh basil. Serve right away while it is still warm.' },
  ];

  /** The steps in rows of two (step 1 and 2, step 3 and 4, and so on). */
  protected readonly stepRows = Array.from({ length: Math.ceil(this.steps.length / 2) }, (_, row) =>
    this.steps.slice(row * 2, row * 2 + 2),
  );

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

  /** Returns the chef label of the chef who does the given step. */
  protected chefOf(step: Step): Chef {
    return CHEFS[step.chef - 1];
  }

  /** Whether the user gave this recipe a heart. Only local for now; later it is saved in Supabase. */
  protected readonly liked = signal(false);

  /** Gives the recipe a heart or takes it back. */
  protected toggleLike(): void {
    this.liked.update((value) => !value);
  }
}
