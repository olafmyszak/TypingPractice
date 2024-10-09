import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordGeneratorService } from '../services/word-generator.service';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { catchError, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpStatusCode } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-game-area',
    standalone: true,
    imports: [MatButton, CdkTrapFocus, NgClass, FormsModule, LoginComponent, RouterModule],
    templateUrl: './game-area.component.html',
    styleUrl: './game-area.component.css',
})
export class GameAreaComponent implements OnInit {
    gameStarted: boolean = false;

    randomWord: string = '';
    userInput: string = '';
    flashInput: boolean = false;
    showTryAgain: boolean = false;
    correct: boolean = false;

    congratulations: string[] = [
        'Great job! 🎉',
        'You nailed it! 👏',
        'Awesome! 🌟',
        'Perfect! ✨',
        'Well done! 💪',
        'You got it! 🎊',
        'Superb! 🌈',
        'Spot on! 🚀',
        'Nice work! 🎖️',
        'Way to go! 🎉',
    ];

    randomCongrats: string = this.congratulations[0];

    timeIntervalSeconds: number = 10;
    timeLeft = signal(this.timeIntervalSeconds * 1000);
    interval: number = 0;

    totalAttempts: number = 0;
    successfulAttempts: number = 0;

    wordGeneratorService = inject(WordGeneratorService);
    cdr = inject(ChangeDetectorRef);
    router = inject(Router);
    authService = inject(AuthService);
    userService = inject(UserService);
    snackBar = inject(MatSnackBar);

    isAuthenticated = toSignal(this.authService.authStatus$, {initialValue: false});

    correctAudio = new Audio(correctSoundPath);

    ngOnInit(): void {
        this.generateRandomWord(); // Populate the wordlist
        this.correctAudio.load();

        if (this.isAuthenticated()) {
            this.userService.getStats().pipe(
                catchError((err) => {
                    if (err.status === 0) {
                        this.openSnackBar('Server connection problem', 'OK');
                    }

                    return EMPTY;
                }),
            ).subscribe({
                next: ({ totalAttempts, successfulAttempts }) => {
                    this.totalAttempts = totalAttempts;
                    this.successfulAttempts = successfulAttempts;
                },
            });
        } else {
            this.totalAttempts = 0;
            this.successfulAttempts = 0;
        }
    }


    startGame(): void {
        this.gameStarted = true;
        this.generateRandomWord();
        this.startTimer();
    }

    stopGame(): void {
        this.gameStarted = false;
        clearInterval(this.interval);
    }

    generateRandomWord(): void {
        this.wordGeneratorService.getRandomWord().subscribe((word) => {
            this.randomWord = word.toLowerCase();
            this.clearUserInput(0);
            this.cdr.markForCheck();
        });
    }

    onInput(): void {
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
            //If user input is correct
            this.correct = true;
            this.showTryAgain = false;
            this.flashInput = false;

            ++this.successfulAttempts;
            ++this.totalAttempts;

            this.generateRandomWord();

            if (this.timeIntervalSeconds > 1.0) {
                this.timeIntervalSeconds -= 0.5; // Decrease time interval for typing in the word by 0.5 second if correctly typed
            }

            this.startTimer();

            this.randomCongrats =
                this.congratulations[
                    Math.floor(Math.random() * this.congratulations.length)
                    ];

            // this.playSound(correctSoundPath);
            void this.correctAudio.play();

            setTimeout(() => {
                this.correct = false;
            }, 900);
        }
    }

    startTimer(): void {
        this.timeLeft.set(this.timeIntervalSeconds * 1000);

        clearInterval(this.interval);

        this.interval = window.setInterval(() => {
            if (this.timeLeft() <= 0) {
                this.timeIntervalSeconds += 0.5; // Increase time interval for typing in the word by 0.5 second if time ran out
                clearInterval(this.interval);
                ++this.totalAttempts;
                this.generateRandomWord();
                this.startTimer();
                return;
            }

            this.timeLeft.update((value) => value - 100);
        }, 100);
    }

    clearUserInput(timeout: number): void {
        setTimeout(() => {
            this.userInput = '';
        }, timeout);
    }

    logout() {
        this.userService.updateStats({
            totalAttempts: this.totalAttempts,
            successfulAttempts: this.successfulAttempts,
        }).pipe(
            catchError((err) => {
                if (err.status === 0) {
                    this.openSnackBar('Server connection problem', 'OK');
                } else if (err.status === HttpStatusCode.NotFound) {
                    this.openSnackBar('Authentication problem', 'OK');
                }

                return EMPTY;
            }),
        ).subscribe({
            next: () => {
                this.authService.logout();
                // location.reload();
                this.ngOnInit();
            }
        });
    }

    private openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
            verticalPosition: 'bottom',
        });
    }
}

export const correctSoundPath: string = '/assets/correct.wav';
