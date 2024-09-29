import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WordGeneratorService {
  private wordlist: string[] = [];

  http = inject(HttpClient);

  getWordList(): Observable<string[]> {
    return this.http.get(wordlist, {responseType: 'text'}).pipe(
      map((data: string) => {
        return data.split(/\r?\n/).filter(word => word.trim().length > 0); // Split words by newline
      }),
      catchError((err) => {
        console.log("Error: ", err);
        return of();
      })
    );
  }

  getRandomWord(): Observable<string> {
    if (this.wordlist.length === 0) {
      return this.getWordList().pipe(
        map(wordlist => {
          this.wordlist = wordlist;
          return this.wordlist[Math.floor(Math.random() * this.wordlist.length)];
        })
      );
    } else {
      return of(this.wordlist[Math.floor(Math.random() * this.wordlist.length)]);
    }
  }
}

export const wordlist: string = '/assets/wordlist_short.txt';
