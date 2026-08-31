import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocMetadata {
  documentId: string;
  title: string | null;
  author: string | null;
  lastEditor: string | null;
  creationDate: string | null;
  modificationDate: string | null;
  format: string | null;
  language: string | null;
  pageCount: number | null;
  fileSize: string | null;
  revision: number | null;
  organization: string | null;
  encrypted: boolean | null;
  signed: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentMetadataService {
  private http = inject(HttpClient);

  getMetadata(documentId: string): Observable<DocMetadata> {
    return this.http.get<DocMetadata>(
      `${environment.apiUrl}/api/dms/extraction/documents/metadata`,
      { params: { id: documentId } }
    );
  }
}