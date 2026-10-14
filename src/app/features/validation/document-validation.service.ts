import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DocumentTag,
  PendingDocument,
  TaxonomyDomain,
  ValidateDocumentRequest,
  ValidationDetail
} from './validation-detail.model';

@Injectable({ providedIn: 'root' })
export class DocumentValidationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/document`;

  getPending(): Observable<PendingDocument[]> {
    return this.http.get<PendingDocument[]>(`${this.baseUrl}/pending-validation`);
  }

  getDomains(): Observable<TaxonomyDomain[]> {
    return this.http.get<TaxonomyDomain[]>(`${this.baseUrl}/taxonomy/domains`);
  }

  getDetail(id: string): Observable<ValidationDetail> {
    return this.http.get<ValidationDetail>(`${this.baseUrl}/${id}/validation`);
  }

  validate(id: string, request: ValidateDocumentRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/validate`, request);
  }

  /** Supprime définitivement un document pas encore publié (fichier, métadonnées, tags). */
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addTag(id: string, label: string): Observable<DocumentTag> {
    return this.http.post<DocumentTag>(`${this.baseUrl}/${id}/tags`, { label });
  }

  acceptTag(id: string, tagId: string): Observable<DocumentTag> {
    return this.http.post<DocumentTag>(`${this.baseUrl}/${id}/tags/${tagId}/accept`, {});
  }

  rejectTag(id: string, tagId: string): Observable<DocumentTag> {
    return this.http.post<DocumentTag>(`${this.baseUrl}/${id}/tags/${tagId}/reject`, {});
  }

  deleteTag(id: string, tagId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/tags/${tagId}`);
  }
}