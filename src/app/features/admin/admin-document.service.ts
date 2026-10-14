import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FailedDocument, RetryResult } from './failed-document.model';
import { OwnerlessDocument } from './ownerless-document.model';

@Injectable({ providedIn: 'root' })
export class AdminDocumentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/admin/documents`;

  getFailed(): Observable<FailedDocument[]> {
    return this.http.get<FailedDocument[]>(`${this.baseUrl}/failed`);
  }

  /** Relance l'extraction (EXTRACTION_FAILED) ou la publication (INDEXING_FAILED). */
  retry(id: string): Observable<RetryResult> {
    return this.http.post<RetryResult>(`${this.baseUrl}/${id}/retry`, {});
  }

  getWithoutOwner(): Observable<OwnerlessDocument[]> {
    return this.http.get<OwnerlessDocument[]>(`${this.baseUrl}/without-owner`);
  }

  /** Rattache ces documents à l'utilisateur : tous ou aucun. */
  assignOwner(documentIds: string[], ownerId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/owner`, { documentIds, ownerId });
  }
}
