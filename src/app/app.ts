import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Root component. Hosts the router outlet for all pages. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
