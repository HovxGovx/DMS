import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LifecycleDocument } from './lifecycle-document.model';

@Injectable({ providedIn: 'root' })
export class LifecycleDocumentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/lifecycle/documents`;

  getAll(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(this.baseUrl);
  }

  publish(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/publish`, {});
  }
}