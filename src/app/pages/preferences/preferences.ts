import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Step 2 of the generator: the user chooses portions, helpers, time, cuisine and diet. */
@Component({
  selector: 'app-preferences',
  imports: [RouterLink],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {}
