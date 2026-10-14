import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Configuration préparée et signée par le backend (document, editorConfig, token…), passée telle quelle à OnlyOffice. */
export type DocsEditorConfig = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class EditorConfigService {
  private http = inject(HttpClient);

  getConfig(documentId: string): Observable<DocsEditorConfig> {
    return this.http.get<DocsEditorConfig>(`${environment.apiUrl}/api/dms/document/${documentId}/editor/config`);
  }
}
