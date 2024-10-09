import { inject, Injectable } from '@angular/core';
import {
    RegisterUserDto,
    UserStatsDto,
    UserStatsResponse,
    UserRegistrationResponse,
} from '../models/user.model';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    http = inject(HttpClient);

    register(registerUserDto: RegisterUserDto): Observable<UserRegistrationResponse> {
        return this.http.post<UserRegistrationResponse>(`${environment.baseUrl}/user/register`, registerUserDto).pipe(
            tap({
                error: err => {
                    console.error(err);
                    console.log(`Registration failed: ${err.message}`);
                },
            }),
        );
    }

    getStats(): Observable<UserStatsResponse> {
        return this.http.get<UserStatsResponse>(`${environment.baseUrl}/user/stats`).pipe(
            tap({
                error: err => {
                    console.error(err);
                    console.log(`Get stats failed: ${err.message}`);
                }
            })
        );
    }

    updateStats(userStatsDto: UserStatsDto): Observable<UserStatsResponse> {
        return this.http.patch<UserStatsResponse>(`${environment.baseUrl}/user/stats`, userStatsDto).pipe(
            tap({
                error: err => {
                    console.error(err);
                    console.log(`Update stats failed: ${err.message}`);
                }
            })
        );
    }
}
