import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { IngestPanelComponent } from '../../features/upload/ingest-panel/ingest-panel.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DocumentDetailPanelComponent } from '../../features/documents/document-detail/document-detail-panel/document-detail-panel.component';
import { ValidationViewComponent } from '../../features/validation/validation-view/validation-view.component';
import { DocumentStateService } from '../../features/documents/document-state.service';
import { toDocumentDetail } from '../../features/documents/document.model';
import { ViewStateService } from '../../core/view-state.service';
import { AuthService } from '../../core/auth.service';
import { mergeWithRealMetadata } from '../../features/documents/document.mapper';
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, TopbarComponent, IngestPanelComponent,
    SidebarComponent, DocumentDetailPanelComponent, ValidationViewComponent
  ],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  currentView = signal<'documents' | 'validation'>('documents');
  documentState = inject(DocumentStateService);
  viewState = inject(ViewStateService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.fetchCurrentUser().subscribe({
      error: (err) => console.error('Impossible de récupérer les infos utilisateur:', err)
    });
  }

  selectDetail = computed(() => {
    const doc = this.documentState.selectedDocument();
    if (!doc) return null;

    const base = toDocumentDetail(doc);
    return mergeWithRealMetadata(base, this.documentState.documentMetadata());
  });

  toggleView() {
    this.currentView.update(v => v === 'documents' ? 'validation' : 'documents');
  }
}
