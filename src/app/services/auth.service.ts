import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, of, Subscription, switchMap, tap, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    jwtHelperService = inject(JwtHelperService);

    private authStatusSubject = new BehaviorSubject<boolean>(
        !this.jwtHelperService.isTokenExpired(localStorage.getItem(environment.access_token)));
    authStatus$ = this.authStatusSubject.asObservable().pipe(
        tap(authStatus => {
            console.log(authStatus);
        }),
    );

    timerSub$: Subscription = Subscription.EMPTY;

    login(username: string, password: string) {
        return this.http
            .post<{ access_token: string; }>(`${environment.baseUrl}/auth/login`, { username, password }).pipe(
                tap({
                    next: res => {
                        localStorage.setItem(environment.access_token, res.access_token);
                        this.authStatusSubject.next(true);
                        this.startTokenExpirationTimer();
                    },
                    error: err => {
                        console.error(err);
                        console.log(`Login failed: ${err.message}`);
                    },
                }),
            );
    }

    logout(): void {
        localStorage.removeItem(environment.access_token);
        this.authStatusSubject.next(false);
    }

    register(username: string, password: string) {

    }

    private startTokenExpirationTimer(): void {
        const token = localStorage.getItem(environment.access_token);

        if (token == null) {
            this.authStatusSubject.next(false);
            return;
        }

        const expirationDate: Date | null = this.jwtHelperService.getTokenExpirationDate(token);

        if (expirationDate == null) {
            this.authStatusSubject.next(false);
            return;
        }

        const expiresIn = expirationDate.getTime() - Date.now();

        if (expiresIn <= 0) {
            this.authStatusSubject.next(false);
            return;
        }

        if (this.timerSub$ !== Subscription.EMPTY) {
            this.timerSub$.unsubscribe();
        }

        this.timerSub$ = timer(expiresIn).pipe(
            switchMap(() => {
                this.authStatusSubject.next(false);
                return of(false);
            }),
        ).subscribe();
    }
}
