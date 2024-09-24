import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WordGeneratorService} from "../word-generator.service";
import {CdkTrapFocus} from "@angular/cdk/a11y";

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    FormsModule,
    CdkTrapFocus
  ],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.css'
})
export class GameAreaComponent {
  gameStarted: boolean = false;

  randomWord: string = "";
  userInput: string = "";

  timeIntervalSeconds: number = 5;
  timeLeft = this.timeIntervalSeconds * 1000;
  interval: number = 0;

  totalAttempts: number = 0;
  successfulAttempts: number = 0;

  wordGeneratorService = inject(WordGeneratorService);
  cdr = inject(ChangeDetectorRef);

  startGame(): void {
    this.gameStarted = true;
    this.generateRandomWord();
    this.startTimer();
  }

  stopGame(): void {
    this.gameStarted = false;
    clearInterval(this.interval);
  }

  generateRandomWord() {
    this.wordGeneratorService.getRandomWord().subscribe((word) => {
      this.randomWord = word;
      this.userInput = "";
    })
  }

  onInput() {
    let incorrect: boolean = false;

    for(let i=0; i<this.userInput.length; ++i) {
      if(i >= this.randomWord.length) {
        incorrect = true;
        //make this char red
      }
    }
  }

  startTimer() {
    this.timeLeft = this.timeIntervalSeconds * 1000;

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        ++this.totalAttempts;
        this.generateRandomWord();
        this.cdr.markForCheck();
        this.startTimer();
        return;
      }

      this.timeLeft -= 100;
      this.cdr.markForCheck();
    }, 100);
  }
}
