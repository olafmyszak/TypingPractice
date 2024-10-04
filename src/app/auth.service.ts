import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);

    login(username: string, password: string): Observable<string | null> {
        return this.http
            .post<{
                access_token: string;
            }>(`${environment.baseUrl}/auth/login`, { username, password })
            .pipe(
                map((res) => res.access_token),
                catchError(this.handleError('login', null))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
