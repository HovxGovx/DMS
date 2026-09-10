import { Component, signal, inject, computed, OnInit, HostListener } from '@angular/core';
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
export class ShellComponent implements OnInit {
  viewState = inject(ViewStateService);

  // Largeurs des colonnes en pixels
  leftWidth = signal(260);
  rightWidth = signal(280);

  private resizingLeft = false;
  private resizingRight = false;

  documentState = inject(DocumentStateService);
  // viewState = inject(ViewStateService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.fetchCurrentUser().subscribe({
      error: (err) => console.error('Impossible de récupérer les infos utilisateur:', err)
    });
  }

  selectedDetail = computed(() => {
    const doc = this.documentState.selectedDocument();
    if (!doc) return null;

    const base = toDocumentDetail(doc);
    return mergeWithRealMetadata(base, this.documentState.documentMetadata());
  });

  toggleView() {
    this.viewState.toggleValidationPanel();
  }

  // Logique de redimensionnement
  startResizingLeft() { this.resizingLeft = true; }
  startResizingRight() { this.resizingRight = true; }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizingLeft) {
      const newWidth = event.clientX;
      if (newWidth > 150 && newWidth < 500) {
        this.leftWidth.set(newWidth);
      }
    }
    if (this.resizingRight) {
      const newWidth = window.innerWidth - event.clientX;
      if (newWidth > 150 && newWidth < 600) {
        this.rightWidth.set(newWidth);
      }
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.resizingLeft = false;
    this.resizingRight = false;
  }
}
