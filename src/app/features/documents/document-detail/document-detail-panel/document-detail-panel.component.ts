import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentInfoCardComponent } from '../document-info-card/document-info-card.component';
import { DocumentMetadataSectionComponent } from '../document-metadata-section/document-metadata-section.component';
import { DocumentHistorySectionComponent } from '../document-history-section/document-history-section.component';
import { DocumentDetail } from '../../document.model';
import { DocumentLocationService } from '../../document-location.service';
import { DocumentUnpublishService } from '../../document-unpublish.service';
import { AuthService } from '../../../../core/auth.service';
import { DocumentStateService } from '../../document-state.service';
import { LifecycleDocumentService } from '../../../validation/lifecycle-document.service';
import { NotificationService } from '../../../../core/notification.service';
import { LayoutStateService } from '../../../../core/layout-state.service';
import { httpErrorMessage } from '../../../../core/http-error-message';

@Component({
  selector: 'app-document-detail-panel',
  standalone: true,
  imports: [DocumentInfoCardComponent, DocumentMetadataSectionComponent, DocumentHistorySectionComponent],
  templateUrl: './document-detail-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class DocumentDetailPanelComponent {
  private locationService = inject(DocumentLocationService);
  private router = inject(Router);
  private unpublishService = inject(DocumentUnpublishService);
  protected authService = inject(AuthService);
  private lifecycleService = inject(LifecycleDocumentService);
  private documentState = inject(DocumentStateService);
  private notification = inject(NotificationService);
  protected layout = inject(LayoutStateService);

  document = input.required<DocumentDetail>();
  isChangingAccess = signal(false);
  isUnpublishing = computed(() => this.unpublishService.unpublishingId() === this.document().docId);
  copyTitle() {
    const title = this.document().name;
    // L'API presse-papiers n'existe qu'en HTTPS ou sur localhost
    if (!navigator.clipboard) {
      this.notification.warn(`Copie impossible ici. Titre : ${title}`);
      return;
    }
    navigator.clipboard.writeText(title).then(
      () => this.notification.success('Titre copié dans le presse-papiers.'),
      () => this.notification.error('Impossible de copier le titre.')
    );
  }

  /** Affiche le document en pleine page. */
  viewDocument() {
    this.router.navigate(['/documents', this.document().docId, 'editor']);
  }

  revealInFolder() {
    this.locationService.revealInFolder(this.document().docId);
  }

  unpublish() {
    this.unpublishService.unpublish(this.document().docId, this.document().name);
  }

  /** Bascule Public / Confidentiel ; la recherche suit aussitôt (réindexation côté backend). */
  toggleConfidentiality() {
    const { docId, confidential } = this.document();
    const next = confidential ? 'PUBLIC' : 'CONFIDENTIAL';
    this.isChangingAccess.set(true);
    this.lifecycleService.changeConfidentiality(docId, next).subscribe({
      next: () => {
        this.isChangingAccess.set(false);
        this.documentState.setConfidential(docId, !confidential);
        this.notification.success(confidential ? 'Le document est maintenant public.' : 'Le document est maintenant confidentiel.', 'Accès');
      },
      error: (err) => {
        this.isChangingAccess.set(false);
        this.notification.error(httpErrorMessage(err, "Impossible de changer l'accès au document.", {
          403: `Ce document a été importé hors de vos domaines : vous ne pouvez pas changer son accès.`
        }), 'Accès');
      }
    });
  }
}
