import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ImportQueueListComponent } from '../import-queue-list/import-queue-list.component';
import { ImportDetailPanelComponent } from '../import-detail-panel/import-detail-panel.component';
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
import { TaxonomyDomain } from '../validation-detail.model';
import { NotificationService } from '../../../core/notification.service';

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
export class ValidationViewComponent implements OnInit {
  state = inject(ValidationStateService);
  private validationService = inject(DocumentValidationService);
  private notification = inject(NotificationService);

  domains = signal<TaxonomyDomain[]>([]);
  domainCode = signal<string | null>(null);
  typeCode = signal<string | null>(null);
  confidentiality = signal<string | null>('Interne');
  isValidating = signal(false);

  domainOptions = computed<SelectOption[]>(() =>
    this.domains().map(d => ({ label: d.label, value: d.code }))
  );

  typeOptions = computed<SelectOption[]>(() => {
    const domain = this.domains().find(d => d.code === this.domainCode());
    return domain ? domain.types.map(t => ({ label: t.label, value: t.code })) : [];
  });

  confidentialityOptions: SelectOption[] = ['Public', 'Interne', 'Confidentiel', 'Restreint']
    .map(level => ({ label: level, value: level }));

  constructor() {
    // Reset the form selection each time another document is loaded
    effect(() => {
      const detail = this.state.detail();
      this.domainCode.set(detail?.domainCode ?? null);
      this.typeCode.set(detail?.typeCode ?? null);
    });
  }

  ngOnInit() {
    this.validationService.getDomains().subscribe({
      next: domains => this.domains.set(domains),
      error: err => {
        this.notification.error('Impossible de charger les domaines et types de documents.', 'Validation');
        console.error('Erreur chargement taxonomie:', err);
      }
    });
  }

  onDomainChange(code: string | null) {
    this.domainCode.set(code);
    this.typeCode.set(null);
  }

  canValidate(): boolean {
    const doc = this.state.detail();
    return !!doc && doc.title.trim().length > 0 && !!this.typeCode() && !this.isValidating();
  }

  onCancel() {
    console.log('Annuler import:', this.state.selectedImportId());
  }

  onValidate() {
    const doc = this.state.detail();
    const typeCode = this.typeCode();
    if (!doc || !typeCode || !this.canValidate()) return;

    this.isValidating.set(true);
    this.validationService.validate(doc.id, { title: doc.title.trim(), typeCode }).subscribe({
      next: () => {
        this.isValidating.set(false);
        this.notification.success(`${doc.fileName} a été validé et publié.`, 'Validation');
        this.state.removeFromPending(doc.id);
      },
      error: (err) => {
        this.isValidating.set(false);
        const serverMessage = err.error?.message;
        this.notification.error(serverMessage ?? `Échec de la validation de ${doc.fileName}.`, 'Validation');
        console.error('Erreur validation:', err);
      }
    });
  }
}