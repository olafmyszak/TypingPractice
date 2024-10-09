import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { passwordMatchValidator } from '../shared/password-matches.directive';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    form = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: passwordMatchValidator() });

    router = inject(Router);
    userService = inject(UserService);
    snackBar = inject(MatSnackBar);

    register(): void {
        const val = this.form.value;

        if (val.username && val.password && val.confirmPassword) {
            this.userService.register({ username: val.username, password: val.password }).pipe(
                catchError((err) => {
                    if (err.status === 0) {
                        this.openSnackBar('Server connection problem', 'OK');
                    } else if (err.status === HttpStatusCode.Conflict) {
                        this.openSnackBar('Username is taken', 'OK');
                    }

                    return EMPTY;
                }),
            ).subscribe({
                next: () => {
                    this.openSnackBar('You can now sign in', 'OK');
                    void this.router.navigate(['/']);
                },
            });

        }
    }

    private openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
            verticalPosition: 'bottom',
        });
    }

}
