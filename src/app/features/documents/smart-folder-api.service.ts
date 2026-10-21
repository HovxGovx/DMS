import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateSmartFolderRequest,
  CriterionFieldDefinition,
  FolderDocument,
  FolderDocumentsPage,
  SmartFolderDetail,
  SmartFolderNode,
  SmartFolderSummary,
  UpdateSmartFolderRequest
} from './smart-folder.model';

/** Taille de page maximale acceptée par le backend pour les documents d'un dossier. */
const FOLDER_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class SmartFolderApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/dms/document/folders`;
  private criterionFields$?: Observable<CriterionFieldDefinition[]>;

  getChildren(parentId: string | null): Observable<SmartFolderNode[]> {
    const params = parentId ? new HttpParams().set('parentId', parentId) : new HttpParams();
    return this.http.get<SmartFolderNode[]>(this.baseUrl, { params });
  }

  getDocuments(folderId: string, page = 0, size = FOLDER_PAGE_SIZE): Observable<FolderDocumentsPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<FolderDocumentsPage>(`${this.baseUrl}/${folderId}/documents`, { params });
  }

  /**
   * Tous les documents du dossier : le tableau pagine et filtre par tags sur la liste complète.
   * Le backend plafonne une page à 100 : les pages suivantes sont demandées ensemble après la première.
   */
  getAllDocuments(folderId: string): Observable<FolderDocument[]> {
    return this.getDocuments(folderId).pipe(
      switchMap(first => {
        const size = first.size || FOLDER_PAGE_SIZE;
        const pageCount = Math.ceil(first.total / size);
        if (pageCount <= 1) return of(first.content);
        const others = Array.from({ length: pageCount - 1 }, (_, i) => this.getDocuments(folderId, i + 1, size));
        return forkJoin(others).pipe(map(pages => [first, ...pages].flatMap(page => page.content)));
      })
    );
  }

  // Le catalogue ne change pas pendant la session : on ne l'appelle qu'une fois
  getCriterionFields(): Observable<CriterionFieldDefinition[]> {
    if (!this.criterionFields$) {
      this.criterionFields$ = this.http
        .get<CriterionFieldDefinition[]>(`${this.baseUrl}/criteria-fields`)
        .pipe(shareReplay(1));
    }
    return this.criterionFields$;
  }

  getDetail(id: string): Observable<SmartFolderDetail> {
    return this.http.get<SmartFolderDetail>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateSmartFolderRequest): Observable<SmartFolderSummary> {
    return this.http.post<SmartFolderSummary>(this.baseUrl, request);
  }

  update(id: string, request: UpdateSmartFolderRequest): Observable<SmartFolderSummary> {
    return this.http.put<SmartFolderSummary>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}