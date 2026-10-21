import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RagAnswer } from './rag.model';

@Injectable({ providedIn: 'root' })
export class RagService {
  private http = inject(HttpClient);

  /** Question en langage courant : la réponse ne s'appuie que sur les documents que l'utilisateur peut lire. */
  ask(question: string): Observable<RagAnswer> {
    return this.http.post<RagAnswer>(`${environment.apiUrl}/api/dms/rag/ask`, { question });
  }
}
