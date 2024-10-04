import {
    ApplicationConfig,
    importProvidersFrom,
    provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
    provideRouter,
    withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

export function tokenGetter() {
    return localStorage.getItem(environment.access_token);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter(
            routes,
            withRouterConfig({ onSameUrlNavigation: 'reload' })
        ),
        provideAnimationsAsync(),
        importProvidersFrom(
            JwtModule.forRoot({
                config: {
                    tokenGetter: tokenGetter,
                },
            })
        ),
        provideHttpClient(withInterceptorsFromDi()),
    ],
};
