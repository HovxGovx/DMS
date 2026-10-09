import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FolderPathItem } from './smart-folder.model';
import { SmartFolderStateService } from './smart-folder-state.service';
import { DocumentStateService } from './document-state.service';
import { ViewStateService } from '../../core/view-state.service';
import { NotificationService } from '../../core/notification.service';

/**
 * Emplacement d'un document dans les dossiers système (par domaine puis par type, ou "Non classés")
 * et navigation jusqu'à ce dossier depuis un résultat de recherche ou le panneau de détails.
 */
@Injectable({ providedIn: 'root' })
export class DocumentLocationService {
  private http = inject(HttpClient);
  private folderState = inject(SmartFolderStateService);
  private documentState = inject(DocumentStateService);
  private viewState = inject(ViewStateService);
  private notification = inject(NotificationService);

  getLocation(documentId: string): Observable<FolderPathItem[]> {
    return this.http.get<FolderPathItem[]>(`${environment.apiUrl}/api/dms/document/${documentId}/location`);
  }

  /** Quitte la recherche, déplie l'arborescence jusqu'au dossier du document, l'ouvre et sélectionne le document. */
  revealInFolder(documentId: string) {
    this.getLocation(documentId).subscribe({
      next: path => {
        if (!path.length) {
          this.notification.warn("Le dossier de ce document est introuvable.", 'Emplacement');
          return;
        }
        this.viewState.setView('documents');
        this.folderState.revealPath(path.map(item => item.id));
        this.documentState.selectDocument(documentId);
      },
      error: () => this.notification.error("Impossible de retrouver l'emplacement du document.", 'Emplacement')
    });
  }
}
