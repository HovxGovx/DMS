import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Confidentiality, LifecycleDocument, BatchUploadResult } from './lifecycle-document.model';

@Injectable({ providedIn: 'root' })
export class LifecycleDocumentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/lifecycle/documents`;

  uploadBatch(files: File[]): Observable<BatchUploadResult> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.http.post<BatchUploadResult>(`${this.baseUrl}/batch/upload`, formData);
  }

  /** Documents importés par l'utilisateur connecté, quel que soit leur statut (contributeurs). */
  getMine(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(`${this.baseUrl}/mine`);
  }

  getPublished(): Observable<LifecycleDocument[]> {
    return this.http.get<LifecycleDocument[]>(`${this.baseUrl}/published`);
  }

  /** Retire le document de la recherche ; il revient dans la file « À publier ». */
  unpublish(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/unpublish`, null);
  }

  /** Un document publié est réindexé aussitôt : la recherche suit le nouveau niveau. */
  changeConfidentiality(id: string, confidentiality: Confidentiality): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/confidentiality`, { confidentiality });
  }
}