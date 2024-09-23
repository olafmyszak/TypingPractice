import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GameAreaComponent} from "./game-area/game-area.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TypingPractice';
}
