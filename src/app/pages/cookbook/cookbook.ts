import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewRecipeLink } from '../../components/new-recipe-link/new-recipe-link';
import { DragScroll } from '../../directives/drag-scroll';

/** Number of cards in the "Most liked recipes" row. */
const MAX_MOST_LIKED = 5;

/** The cuisine categories with their emoji, the emoji's hover effect and the picture, in the order they are shown. */
const CUISINES = [
  { name: 'Italian', emoji: '🤌', image: 'images/cuisine-italian.webp', effect: 'tilt-right' },
  { name: 'German', emoji: '🥨', image: 'images/cuisine-german.webp', effect: 'flip' },
  { name: 'Japanese', emoji: '🥢', image: 'images/cuisine-japanese.webp', effect: 'tilt-left' },
  { name: 'Gourmet', emoji: '✨', image: 'images/cuisine-gourmet.webp', effect: 'shine' },
  { name: 'Indian', emoji: '🍛', image: 'images/cuisine-indian.webp', effect: 'flip' },
  { name: 'Fusion', emoji: '🍢', image: 'images/cuisine-fusion.webp', effect: 'hop' },
];

/** Recipe library (cookbook): public recipes with an introduction, the most liked recipes and categories. */
@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, DragScroll, NewRecipeLink],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
  /** The cuisine categories shown below the introduction. */
  protected readonly cuisines = CUISINES;

  /** The most liked recipes, at most 5. Sample data for now; they will come from Supabase. */
  protected readonly mostLiked = [
    { id: 1, title: 'Pasta with spinach and cherry tomatoes', minutes: 20, likes: 66 },
    { id: 2, title: 'Low Carb Vegan No-Bake Paleo Bars', minutes: 35, likes: 57 },
    { id: 3, title: 'Schnitzel with fries', minutes: 45, likes: 51 },
    { id: 4, title: 'Pasta with spinach and cherry tomatoes', minutes: 20, likes: 49 },
    { id: 5, title: 'Low Carb Vegan No-Bake Paleo Bars', minutes: 35, likes: 44 },
  ].slice(0, MAX_MOST_LIKED);
}
