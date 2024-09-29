import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WordGeneratorService} from "../word-generator.service";
import {CdkTrapFocus} from "@angular/cdk/a11y";

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [
    MatButton,
    CdkTrapFocus,
    NgClass,
    FormsModule
  ],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.css'
})
export class GameAreaComponent {
  gameStarted: boolean = false;

  randomWord: string = "";
  userInput: string = "";
  flashInput: boolean = false;
  showTryAgain: boolean = false;
  correct: boolean = false;

  congratulations: string[] = [
    "Great job! 🎉",
    "You nailed it! 👏",
    "Awesome! 🌟",
    "Perfect! ✨",
    "Well done! 💪",
    "You got it! 🎊",
    "Superb! 🌈",
    "Spot on! 🚀",
    "Nice work! 🎖️",
    "Way to go! 🎉",
  ]

  randomCongrats = this.congratulations[0];

  timeIntervalSeconds: number = 20;
  timeLeft = signal(this.timeIntervalSeconds * 1000);
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
      this.randomWord = word.toLowerCase();
      this.clearUserInput(0);
      this.cdr.markForCheck();
    })
  }

  onInput() {
    const inputLowered = this.userInput.toLowerCase();

    if (!this.randomWord.startsWith(inputLowered)) {
      this.flashInput = true;
      this.showTryAgain = true;
      this.correct = false;
      this.clearUserInput(200);

      setTimeout(() => {
        this.showTryAgain = false;
        this.flashInput = false;
      }, 900);

      ++this.totalAttempts;
    } else if (inputLowered === this.randomWord) {
      this.correct = true;
      ++this.successfulAttempts;
      ++this.totalAttempts;
      this.generateRandomWord();
      this.clearUserInput(0);
      this.startTimer();

      this.randomCongrats = this.congratulations[Math.floor(Math.random() * this.congratulations.length)]

      this.showTryAgain = false;
      this.flashInput = false;
      setTimeout(() => {
        this.correct = false;
      }, 900);
    }
  }

  startTimer() {
    this.timeLeft.set(this.timeIntervalSeconds * 1000);

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.timeLeft() <= 0) {
        clearInterval(this.interval);
        ++this.totalAttempts;
        this.generateRandomWord();
        this.startTimer();
        return;
      }

      this.timeLeft.update(value => value - 100);
    }, 100);
  }

  clearUserInput(timeout: number) {
    setTimeout(() => {
      this.userInput = '';
    }, timeout);
  }

  protected readonly Math = Math;
}
