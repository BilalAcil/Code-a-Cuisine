import { Routes } from '@angular/router';
import { ingredientsGuard } from './guards/ingredients.guard';

/** Application routes. Pages are lazy-loaded to keep the initial bundle small. */
export const routes: Routes = [
  {
    path: '',
    title: 'Code à Cuisine',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'generate',
    title: 'Generate recipes | Code à Cuisine',
    loadComponent: () => import('./pages/generate/generate').then((m) => m.Generate),
  },
  {
    path: 'generate/preferences',
    title: 'Choose your preferences | Code à Cuisine',
    canActivate: [ingredientsGuard],
    loadComponent: () => import('./pages/preferences/preferences').then((m) => m.Preferences),
  },
  {
    path: 'loading',
    title: 'Generating | Code à Cuisine',
    canActivate: [ingredientsGuard],
    loadComponent: () => import('./pages/loading/loading').then((m) => m.Loading),
  },
  {
    path: 'results',
    title: 'Your recipes | Code à Cuisine',
    loadComponent: () => import('./pages/results/results').then((m) => m.Results),
  },
  {
    path: 'recipe/:id',
    title: 'Recipe | Code à Cuisine',
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
  },
  {
    path: 'cookbook',
    title: 'Cookbook | Code à Cuisine',
    loadComponent: () => import('./pages/cookbook/cookbook').then((m) => m.Cookbook),
  },
  { path: '**', redirectTo: '' },
];
