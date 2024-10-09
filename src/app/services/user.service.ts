import { inject, Injectable } from '@angular/core';
import {
    RegisterUserDto,
    UpdateUserStatsDto,
    UpdateUserStatsResponse,
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

    updateStats(updateUserStatsDto: UpdateUserStatsDto): Observable<UpdateUserStatsResponse> {
        return this.http.patch<UpdateUserStatsResponse>(`${environment.baseUrl}/user/stats`, updateUserStatsDto).pipe(
            tap({
                error: err => {
                    console.error(err);
                    console.log(`Update stats failed: ${err.message}`);
                }
            })
        );
    }
}
