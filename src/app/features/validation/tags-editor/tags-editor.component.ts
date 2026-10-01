import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentTag } from '../validation-detail.model';
import { DocumentValidationService } from '../document-validation.service';
import { NotificationService } from '../../../core/notification.service';

@Component({
  selector: 'app-tags-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tags-editor.component.html'
})
export class TagsEditorComponent {
  private validationService = inject(DocumentValidationService);
  private notification = inject(NotificationService);

  documentId = input.required<string>();
  tags = model.required<DocumentTag[]>();

  isAdding = signal(false);
  newTagLabel = signal('');

  accept(tag: DocumentTag) {
    const documentId = this.documentId();
    this.validationService.acceptTag(documentId, tag.id).subscribe({
      next: updated => this.replace(documentId, updated),
      error: () => this.fail('accepter')
    });
  }

  reject(tag: DocumentTag) {
    const documentId = this.documentId();
    this.validationService.rejectTag(documentId, tag.id).subscribe({
      next: updated => this.replace(documentId, updated),
      error: () => this.fail('rejeter')
    });
  }

  startAdding() {
    this.isAdding.set(true);
  }

  confirmAdd() {
    const label = this.newTagLabel().trim();
    this.newTagLabel.set('');
    this.isAdding.set(false);
    if (!label) return;

    const documentId = this.documentId();
    this.validationService.addTag(documentId, label).subscribe({
      next: added => {
        if (documentId !== this.documentId()) return;
        this.tags.update(list =>
          list.some(t => t.id === added.id)
            ? list.map(t => t.id === added.id ? added : t)
            : [...list, added]
        );
      },
      error: () => this.fail('ajouter')
    });
  }

  cancelAdd() {
    this.newTagLabel.set('');
    this.isAdding.set(false);
  }

  private replace(documentId: string, updated: DocumentTag) {
    if (documentId !== this.documentId()) return;
    this.tags.update(list => list.map(t => t.id === updated.id ? updated : t));
  }

  private fail(action: string) {
    this.notification.error(`Impossible d'${action} ce tag.`, 'Tags');
  }
}