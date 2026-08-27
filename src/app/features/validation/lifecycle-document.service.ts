import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LifecycleDocument, BatchUploadResult } from './lifecycle-document.model';

@Injectable({ providedIn: 'root' })
export class LifecycleDocumentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/lifecycle/documents`;

  getAll(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(this.baseUrl);
  }

  getPending(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(`${this.baseUrl}/pending`);
  }

  publish(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/publish`, {});
  }

  uploadBatch(files: File[]): Observable<BatchUploadResult> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.http.post<BatchUploadResult>(`${this.baseUrl}/batch/upload`, formData);
  }

  getPublished(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(`${this.baseUrl}/published`);
  }
}