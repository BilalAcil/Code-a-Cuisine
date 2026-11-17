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
    path: 'cookbook',
    title: 'Cookbook | Code à Cuisine',
    loadComponent: () => import('./pages/cookbook/cookbook').then((m) => m.Cookbook),
  },
  { path: '**', redirectTo: '' },
];
