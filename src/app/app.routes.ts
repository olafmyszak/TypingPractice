import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameAreaComponent } from './game-area/game-area.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: GameAreaComponent },
];
