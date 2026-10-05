import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FolderDocumentsPage, SmartFolderNode } from './smart-folder.model';

@Injectable({ providedIn: 'root' })
export class SmartFolderApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/document/folders`;

  getChildren(parentId: string | null): Observable<SmartFolderNode[]> {
    const params = parentId ? new HttpParams().set('parentId', parentId) : new HttpParams();
    return this.http.get<SmartFolderNode[]>(this.baseUrl, { params });
  }

  getDocuments(folderId: string, page = 0, size = 100): Observable<FolderDocumentsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<FolderDocumentsPage>(`${this.baseUrl}/${folderId}/documents`, { params });
  }
}