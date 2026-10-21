import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { OwnerlessDocumentsStateService } from '../ownerless-documents-state.service';
import { UserAdminStateService } from '../user-admin-state.service';
import { AdminDocumentService } from '../admin-document.service';
import { OwnerlessDocument } from '../ownerless-document.model';
import { ROLE_LABELS } from '../admin-user.model';
import { STATUS_TAGS } from '../../documents/document.mapper';
import { DocTag } from '../../documents/document.model';
import { getFileTypeInfo } from '../../validation/file-type.util';
import { SelectOption } from '../../validation/classification-select/classification-select.component';
import { NotificationService } from '../../../core/notification.service';
import { httpErrorMessage } from '../../../core/http-error-message';

@Component({
  selector: 'app-ownerless-documents-panel',
  standalone: true,
  imports: [FormsModule, Select, Tag],
  templateUrl: './ownerless-documents-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class OwnerlessDocumentsPanelComponent {
  state = inject(OwnerlessDocumentsStateService);
  private userState = inject(UserAdminStateService);
  private adminDocumentService = inject(AdminDocumentService);
  private notification = inject(NotificationService);

  readonly fileType = getFileTypeInfo;

  ownerId = signal<string | null>(null);
  isAssigning = signal(false);

  ownerOptions = computed<SelectOption[]>(() =>
    [...this.userState.users()]
      .sort((a, b) => (a.fullName || a.uid).localeCompare(b.fullName || b.uid))
      .map(u => ({ label: `${u.fullName || u.uid} — ${ROLE_LABELS[u.role]}`, value: u.id }))
  );

  selectedCount = computed(() => this.state.selectedIds().size);

  allFilteredSelected = computed(() => {
    const documents = this.state.filteredDocuments();
    const selected = this.state.selectedIds();
    return documents.length > 0 && documents.every(d => selected.has(d.id));
  });

  canAssign = computed(() => this.selectedCount() > 0 && !!this.ownerId() && !this.isAssigning());

  statusLabel(doc: OwnerlessDocument): string {
    return STATUS_TAGS[doc.status]?.label ?? doc.status;
  }

  statusSeverity(doc: OwnerlessDocument): DocTag['severity'] {
    return STATUS_TAGS[doc.status]?.severity ?? 'secondary';
  }

  displayName(doc: OwnerlessDocument): string {
    return doc.title || doc.fileName;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  onAssign() {
    const ownerId = this.ownerId();
    const ids = [...this.state.selectedIds()];
    if (!ownerId || !ids.length || this.isAssigning()) return;

    const owner = this.userState.users().find(u => u.id === ownerId);
    this.isAssigning.set(true);
    this.adminDocumentService.assignOwner(ids, ownerId).subscribe({
      next: () => {
        this.isAssigning.set(false);
        this.state.removeAll(ids);
        const plural = ids.length > 1 ? 's' : '';
        const ownerName = owner?.fullName || owner?.uid || "l'utilisateur";
        this.notification.success(`${ids.length} document${plural} rattaché${plural} à ${ownerName}.`, 'Administration');
      },
      error: err => {
        this.isAssigning.set(false);
        this.notification.error(httpErrorMessage(err, 'Impossible de rattacher les documents.', {
          409: 'Certains documents ont déjà un propriétaire : rechargez la liste.',
          404: "L'utilisateur choisi ou un des documents n'existe plus : rechargez la liste."
        }), 'Administration');
        // Un document a pu être rattaché entre-temps : on repart de l'état du serveur
        this.state.loadWithoutOwner();
      }
    });
  }
}
