import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAreaComponent } from './game-area.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('GameAreaComponent', () => {
    let component: GameAreaComponent;
    let fixture: ComponentFixture<GameAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameAreaComponent],
            providers: [
                provideExperimentalZonelessChangeDetection(),
                provideHttpClient(withInterceptorsFromDi()),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
