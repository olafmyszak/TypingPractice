import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WordGeneratorService} from "../word-generator.service";
import {CdkTrapFocus} from "@angular/cdk/a11y";
import {interval, Subscription, takeWhile, tap} from "rxjs";

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
export class GameAreaComponent implements OnInit {
  gameStarted: boolean = false;
  randomWord: string = "";
  userInput: string = "";
  timeIntervalSeconds: number = 10;
  timeLeft = this.timeIntervalSeconds * 1000;

  wordGeneratorService = inject(WordGeneratorService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.generateRandomWord();
    this.startTimer();
  }

  generateRandomWord() {
    this.wordGeneratorService.getRandomWord().subscribe((word) => {
      this.randomWord = word;
    })
  }

  onInput() {
    if (this.userInput === this.randomWord) {
      this.generateRandomWord();
      this.userInput = "";
      this.timeLeft = this.timeIntervalSeconds * 1000;
      this.startTimer();
    }
  }

  startTimer() {
   interval(100).pipe(

      takeWhile(() => this.timeLeft > 0),
      tap(() => this.timeLeft -= 100),

    ).subscribe()
  }


}
