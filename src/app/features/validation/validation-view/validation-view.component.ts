import { Component, inject } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';

import { ImportQueueListComponent } from '../import-queue-list/import-queue-list.component';
import { ImportPreviewCardComponent } from '../import-preview-card/import-preview-card.component';
import { TitleFieldComponent } from '../title-field/title-field.component';
import { ClassificationSelectComponent } from '../classification-select/classification-select.component';
import { TagsEditorComponent } from '../tags-editor/tags-editor.component';
import { PathSelectorComponent } from '../path-selector/path-selector.component';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { ValidationFooterComponent } from '../validation-footer/validation-footer.component';

@Component({
  selector: 'app-validation-view',
  standalone: true,
  imports: [
    ImportQueueListComponent,
    ImportPreviewCardComponent,
    TitleFieldComponent,
    ClassificationSelectComponent,
    TagsEditorComponent,
    PathSelectorComponent,
    MetadataFormComponent,
    ValidationFooterComponent
  ],
  templateUrl: './validation-view.component.html',
  host: {
    class: 'flex gap-3 flex-1 min-h-0 h-full'
  }
})
export class ValidationViewComponent {
  state = inject(ValidationStateService);

  documentTypeOptions = ['Contrat', 'Facture', 'Budget', 'Note de frais', 'Rapport'];
  confidentialityOptions = ['Public', 'Interne', 'Confidentiel', 'Restreint'];

  onCancel() {
    console.log('Annuler import:', this.state.selectedImportId());
  }

  onValidate() {
    const id = this.state.selectedImportId();
    if (!id) return;

    // Retire l'import validé de la file
    this.state.pendingImports.update(list => list.filter(i => i.id !== id));

    // Sélectionne automatiquement le suivant, s'il y en a un
    const remaining = this.state.pendingImports();
    this.state.selectedImportId.set(remaining.length ? remaining[0].id : null);
  }
}