import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Placeholder page for the recipe generator. Will be implemented next. */
@Component({
  selector: 'app-generate',
  imports: [RouterLink],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {}
