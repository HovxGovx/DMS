import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchResult } from './search-result.model';
import { AdvancedSearchRequest } from './search-request.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

  /** Seule recherche de l'interface : mots-clés de la barre et filtres éventuels. */
  search(request: AdvancedSearchRequest): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(`${environment.apiUrl}/api/dms/search/advanced`, request);
  }
}
