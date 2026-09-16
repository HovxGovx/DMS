import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EditorConfigService {
  private http = inject(HttpClient);

  getConfig(documentId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/dms/document/${documentId}/editor/config`);
  }
}