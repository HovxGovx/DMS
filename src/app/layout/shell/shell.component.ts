import { Component, inject, computed, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { IngestPanelComponent } from '../../features/upload/ingest-panel/ingest-panel.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DocumentDetailPanelComponent } from '../../features/documents/document-detail/document-detail-panel/document-detail-panel.component';
import { ValidationViewComponent } from '../../features/validation/validation-view/validation-view.component';
import { AdminViewComponent } from '../../features/admin/admin-view/admin-view.component';
import { DocumentStateService } from '../../features/documents/document-state.service';
import { toDocumentDetail, withoutEmptyValues } from '../../features/documents/document.model';
import { ViewStateService } from '../../core/view-state.service';
import { mergeWithRealMetadata } from '../../features/documents/document.mapper';
import { ValidationStateService } from '../../features/validation/validation-state.service';
import { AuthService } from '../../core/auth.service';
import { SmartFolderStateService } from '../../features/documents/smart-folder-state.service';

/** Absence minimale (onglet caché) avant de recharger au retour, pour ignorer les simples allers-retours. */
const REFRESH_AFTER_HIDDEN_MS = 15_000;

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, TopbarComponent, IngestPanelComponent,
    SidebarComponent, DocumentDetailPanelComponent, ValidationViewComponent, AdminViewComponent
  ],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  documentState = inject(DocumentStateService);
  viewState = inject(ViewStateService);
  authService = inject(AuthService);
  private validationState = inject(ValidationStateService);
  private folderState = inject(SmartFolderStateService);

  private hiddenSince: number | null = null;

  selectedDetail = computed(() => {
    const doc = this.documentState.selectedDocument();
    if (!doc) return null;

    const base = toDocumentDetail(doc);
    return withoutEmptyValues(mergeWithRealMetadata(base, this.documentState.documentMetadata()));
  });

  constructor() {
    // Charge la file dès l'arrivée pour que le compteur « À publier » soit juste avant d'ouvrir la vue
    this.validationState.loadPendingImports();
  }

  // Recharge ce que d'autres utilisateurs ont pu modifier pendant que l'onglet était caché.
  // Les résultats d'une recherche ne sont pas relancés : ils correspondent à la requête de l'utilisateur.
  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.hiddenSince = Date.now();
      return;
    }
    const hiddenFor = this.hiddenSince === null ? 0 : Date.now() - this.hiddenSince;
    this.hiddenSince = null;
    if (hiddenFor < REFRESH_AFTER_HIDDEN_MS) return;

    this.folderState.refresh(true, true);
    this.validationState.loadPendingImports();
  }
}
