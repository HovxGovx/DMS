import { Component, HostListener, OnDestroy, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ImportQueueListComponent } from '../import-queue-list/import-queue-list.component';
import { IngestPanelComponent } from '../../upload/ingest-panel/ingest-panel.component';
import { ImportPreviewCardComponent } from '../import-preview-card/import-preview-card.component';
import { TitleFieldComponent } from '../title-field/title-field.component';
import {
  ClassificationSelectComponent,
  SelectOption
} from '../classification-select/classification-select.component';
import { TagsEditorComponent } from '../tags-editor/tags-editor.component';
import { ValidationFooterComponent } from '../validation-footer/validation-footer.component';
import { ValidationStateService } from '../validation-state.service';
import { DocumentValidationService } from '../document-validation.service';
import { DocumentTag, TaxonomyDomain } from '../validation-detail.model';
import { NotificationService } from '../../../core/notification.service';
import { ViewStateService } from '../../../core/view-state.service';
import { SmartFolderStateService } from '../../documents/smart-folder-state.service';
import { DocumentLocationService } from '../../documents/document-location.service';
import { httpErrorMessage } from '../../../core/http-error-message';

@Component({
  selector: 'app-validation-view',
  standalone: true,
  imports: [ImportQueueListComponent,
    IngestPanelComponent,
    ImportPreviewCardComponent,
    TitleFieldComponent,
    ClassificationSelectComponent,
    TagsEditorComponent,
    ValidationFooterComponent],
  templateUrl: './validation-view.component.html',
  host: {
    class: 'flex gap-3 flex-1 min-h-0 h-full'
  }
})
export class ValidationViewComponent implements OnInit, OnDestroy {
  state = inject(ValidationStateService);
  private validationService = inject(DocumentValidationService);
  private notification = inject(NotificationService);
  private viewState = inject(ViewStateService);
  private folderState = inject(SmartFolderStateService);
  private locationService = inject(DocumentLocationService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);

  domains = signal<TaxonomyDomain[]>([]);
  title = signal('');
  domainCode = signal<string | null>(null);
  typeCode = signal<string | null>(null);
  tags = signal<DocumentTag[]>([]);
  confidentiality = signal<string | null>('PUBLIC');
  isPublishing = signal(false);
  isDeleting = signal(false);

  domainOptions = computed<SelectOption[]>(() =>
    this.domains().map(d => ({ label: d.label, value: d.code }))
  );

  typeOptions = computed<SelectOption[]>(() => {
    const domain = this.domains().find(d => d.code === this.domainCode());
    return domain ? domain.types.map(t => ({ label: t.label, value: t.code })) : [];
  });

  confidentialityOptions: SelectOption[] = [
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Confidentiel', value: 'CONFIDENTIAL' }
  ];

  /** Vrai si l'utilisateur a changé le titre, le domaine ou le type chargés. */
  isDirty = computed(() => {
    const doc = this.state.detail();
    if (!doc) return false;
    return this.title() !== doc.title
      || this.domainCode() !== doc.domainCode
      || this.typeCode() !== doc.typeCode
      || this.confidentiality() !== doc.confidentiality;
  });

  /** Raison pour laquelle on ne peut pas publier, affichée à côté du bouton. */
  publishBlocker = computed<string | null>(() => {
    if (!this.state.detail()) return null;
    if (!this.title().trim()) return 'Saisissez un titre pour publier';
    if (!this.domainCode()) return 'Choisissez un domaine pour publier';
    if (!this.typeCode()) return 'Choisissez un type de document pour publier';
    return null;
  });

  canPublish = computed(() =>
    !!this.state.detail() && !this.publishBlocker() && !this.isPublishing() && !this.isDeleting() && !this.state.isDetailLoading()
  );

  pendingTagsCount = computed(() => this.tags().filter(t => t.status === 'PENDING').length);

  constructor() {
    // Repart des valeurs enregistrées à chaque fois qu'un autre document est chargé,
    // sauf si une saisie a été mise de côté pour ce document (retour de l'affichage pleine page)
    effect(() => {
      const detail = this.state.detail();
      const draft = untracked(() => this.state.formDraft());
      const restored = draft && draft.id === detail?.id ? draft : null;
      this.title.set(restored?.title ?? detail?.title ?? '');
      this.domainCode.set(restored ? restored.domainCode : detail?.domainCode ?? null);
      this.typeCode.set(restored ? restored.typeCode : detail?.typeCode ?? null);
      this.confidentiality.set(restored ? restored.confidentiality : detail?.confidentiality ?? 'PUBLIC');
      this.tags.set(detail?.tags ?? []);
      if (draft) untracked(() => this.state.formDraft.set(null));
    });
  }

  ngOnInit() {
    this.validationService.getDomains().subscribe({
      next: domains => this.domains.set(domains),
      error: () => {
        this.notification.error('Impossible de charger les domaines et types de documents.', 'Publication');
      }
    });
  }

  ngOnDestroy() {
    // Garde la saisie en cours si on quitte la vue sans publier
    const detail = this.state.detail();
    this.state.formDraft.set(detail && this.isDirty()
      ? { id: detail.id, title: this.title(), domainCode: this.domainCode(), typeCode: this.typeCode(), confidentiality: this.confidentiality() }
      : null);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.onPublish();
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const target = event.target as HTMLElement | null;
    // Les flèches restent aux champs et listes déroulantes qui ont le focus
    if (target?.closest('input, textarea, select, [contenteditable="true"], [role="combobox"], [role="listbox"], .p-select, .p-overlay')) {
      return;
    }
    event.preventDefault();
    this.state.selectAdjacent(event.key === 'ArrowDown' ? 1 : -1);
  }

  onDomainChange(code: string | null) {
    this.domainCode.set(code);
    this.typeCode.set(null);
  }

  /** Remet le titre, le domaine et le type tels qu'ils étaient au chargement du document. */
  onReset() {
    const detail = this.state.detail();
    if (!detail) return;
    this.title.set(detail.title);
    this.domainCode.set(detail.domainCode);
    this.typeCode.set(detail.typeCode);
    this.confidentiality.set(detail.confidentiality);
  }

  /** Affiche le document en pleine page, comme depuis l'onglet Documents. */
  onViewDocument() {
    const doc = this.state.detail();
    if (!doc) return;
    this.router.navigate(['/documents', doc.id, 'editor']);
  }

  onRevealPublished() {
    const published = this.state.lastPublished();
    if (!published) return;
    this.state.dismissLastPublished();
    this.locationService.revealInFolder(published.id);
  }

  onGoToDocuments() {
    this.viewState.setView('documents');
  }

  /** Supprime définitivement le document sélectionné (import fait par erreur), après confirmation. */
  onDelete() {
    const doc = this.state.detail();
    if (!doc || this.isDeleting() || this.isPublishing()) return;

    this.confirmation.confirm({
      header: 'Suppression',
      message: `Supprimer « ${this.title().trim() || doc.title || doc.fileName} » définitivement ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.isDeleting.set(true);
        this.validationService.deleteDocument(doc.id).subscribe({
          next: () => {
            this.isDeleting.set(false);
            this.state.markDeleted(doc.id);
            this.notification.success('Le document a été supprimé.', 'Publication');
          },
          error: () => {
            this.isDeleting.set(false);
            this.notification.error('Impossible de supprimer le document.', 'Publication');
          }
        });
      }
    });
  }

  onPublish() {
    const doc = this.state.detail();
    const typeCode = this.typeCode();
    if (!doc || !typeCode || !this.canPublish()) return;

    const title = this.title().trim();
    this.isPublishing.set(true);
    const confidentiality = this.confidentiality() === 'CONFIDENTIAL' ? 'CONFIDENTIAL' : 'PUBLIC';
    this.validationService.validate(doc.id, { title, typeCode, confidentiality }).subscribe({
      next: () => {
        this.isPublishing.set(false);
        this.state.markPublished({ id: doc.id, title });
        this.folderState.refresh();
      },
      error: (err) => {
        this.isPublishing.set(false);
        this.notification.error(httpErrorMessage(err, `Échec de la publication de « ${title} ».`, {
          400: 'La publication a été refusée : vérifiez le titre, la confidentialité, le domaine et le type.',
          403: `Ce document a été importé hors de vos domaines : vous ne pouvez pas le publier.`,
          404: "Le document ou le type choisi n'existe plus : rechargez la page.",
          409: `« ${title} » a été publié ou supprimé entre-temps.`
        }), 'Publication');
      }
    });
  }
}
