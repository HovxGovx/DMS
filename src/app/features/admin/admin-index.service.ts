import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Résultat d'une reconstruction complète de l'index de recherche. */
export interface IndexRebuildResult {
  total: number;
  indexed: number;
  /** Documents publiés que la reconstruction n'a pas pu indexer : introuvables par la recherche. */
  failures: { id: string; fileName: string }[];
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class AdminIndexService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/admin/index`;

  rebuild(): Observable<IndexRebuildResult> {
    return this.http.post<IndexRebuildResult>(`${this.baseUrl}/rebuild`, {});
  }
}
