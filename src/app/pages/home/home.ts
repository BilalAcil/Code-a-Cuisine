import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Landing page with the hero section. Links to the generator and the cookbook. */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  /** Plate images shown in the hero column. Plates 4 and 5 only appear on widescreen. */
  protected readonly plates = [1, 2, 3, 4, 5];
}
