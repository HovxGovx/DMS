import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { IngestPanelComponent } from '../../features/upload/ingest-panel/ingest-panel.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DocumentDetailPanelComponent } from '../../features/documents/document-detail/document-detail-panel/document-detail-panel.component';
import { ValidationViewComponent } from '../../features/validation/validation-view/validation-view.component';
import { DocumentStateService } from '../../features/documents/document-state.service';
import { toDocumentDetail } from '../../features/documents/document.model';
import { ViewStateService } from '../../core/view-state.service';

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

  selectedDetail = computed(() => {
    const doc = this.documentState.selectedDocument();
    return doc ? toDocumentDetail(doc) : null;
  });

  toggleView() {
    this.currentView.update(v => v === 'documents' ? 'validation' : 'documents');
  }
}