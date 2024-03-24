import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get searchTerm$() {
    return this.searchTermSubject.asObservable();
  }

  setSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }
}
