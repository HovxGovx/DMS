import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
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

/** Couleurs des étiquettes de statut, reprises des sévérités PrimeNG du tableau des documents. */
const SEVERITY_CLASSES: Record<DocTag['severity'], string> = {
  success: 'bg-emerald-50 text-emerald-700',
  info: 'bg-sky-50 text-sky-700',
  warn: 'bg-amber-50 text-amber-700',
  secondary: 'bg-slate-100 text-slate-600',
  danger: 'bg-red-50 text-red-700'
};

@Component({
  selector: 'app-ownerless-documents-panel',
  standalone: true,
  imports: [FormsModule, Select],
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

  statusClass(doc: OwnerlessDocument): string {
    return SEVERITY_CLASSES[STATUS_TAGS[doc.status]?.severity ?? 'secondary'];
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
        this.notification.error(err.error?.message ?? 'Impossible de rattacher les documents.', 'Administration');
        // Un document a pu être rattaché entre-temps : on repart de l'état du serveur
        this.state.loadWithoutOwner();
      }
    });
  }
}
