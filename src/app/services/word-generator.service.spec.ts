import { TestBed } from '@angular/core/testing';

import { WordGeneratorService } from './word-generator.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('WordGeneratorService', () => {
    let service: WordGeneratorService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WordGeneratorService,
                provideExperimentalZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(WordGeneratorService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch the wordlist from the assets folder and populate the wordlist array', () => {
        const mockWordList = 'apple\nbanana\ncherry';

        // Call the service method
        service.getWordList().subscribe((words) => {
            expect(words.length).toBe(3); // Assert length of words
            expect(words).toEqual(['apple', 'banana', 'cherry']); // Assert the content
        });

        // Simulate the HTTP request
        const req = httpTestingController.expectOne('/assets/wordlist.txt');

        // Check that the request is a GET request
        expect(req.request.method).toBe('GET');

        // Provide a mock response
        req.flush(mockWordList);

        expect(service['wordlist']).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should return a random word from the wordlist once loaded', (done) => {
        const mockWordListText = 'apple\nbanana\ncherry';

        // Preload the word list
        service.getWordList().subscribe();

        // Simulate the HTTP request
        const req = httpTestingController.expectOne('/assets/wordlist.txt');
        req.flush(mockWordListText);

        // Now test the getRandomWord method
        service.getRandomWord().subscribe((randomWord) => {
            expect(['apple', 'banana', 'cherry']).toContain(randomWord); // Ensure it's a valid word from the list
            done();
        });
    });

    it('should handle HTTP errors gracefully', () => {
        const errorMessage = '404 error';

        service.getWordList().subscribe({
            next: () => fail('Expected an error, not wordlist'),
            error: (error) => expect(error.status).toBe(404), // Assert error status
        });

        // Simulate HTTP request and a 404 error
        const req = httpTestingController.expectOne('/assets/wordlist.txt');
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
});
