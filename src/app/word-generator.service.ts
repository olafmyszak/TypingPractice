import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WordGeneratorService {
  private wordlist: string[] = [];
  private wordlistLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  getWordList(): Observable<string[]> {
    return this.http.get('/assets/wordlist.txt', {responseType: 'text'}).pipe(
      map((data: string) => {
        this.wordlist = data.split(/\r?\n/).filter(word => word.trim().length > 0);
        this.wordlistLoaded.next(true);
        return this.wordlist;
      })
    );
  }

  getRandomWord(): Observable<string> {
    if (this.wordlist.length == 0) {
      this.getWordList().subscribe();
    }

    return new Observable<string>(observer => {
      this.wordlistLoaded.subscribe(loaded => {
        if (loaded) {
          const randomIndex = Math.floor(Math.random() * this.wordlist.length);
          observer.next(this.wordlist[randomIndex]);
          observer.complete();
        }
      });
    });
  }
}
