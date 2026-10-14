import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { UserAdminStateService, isWithoutDomain } from '../user-admin-state.service';
import { UserAdminService } from '../user-admin.service';
import { AdminUser, ROLE_LABELS } from '../admin-user.model';
import { DocumentValidationService } from '../../validation/document-validation.service';
import { TaxonomyDomain } from '../../validation/validation-detail.model';
import { SelectOption } from '../../validation/classification-select/classification-select.component';
import { NotificationService } from '../../../core/notification.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-user-domains-panel',
  standalone: true,
  imports: [FormsModule, MultiSelect],
  templateUrl: './user-domains-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class UserDomainsPanelComponent implements OnInit {
  state = inject(UserAdminStateService);
  private userAdminService = inject(UserAdminService);
  private validationService = inject(DocumentValidationService);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  readonly roleLabels = ROLE_LABELS;
  readonly isWithoutDomain = isWithoutDomain;

  domains = signal<TaxonomyDomain[]>([]);
  /** Domaines modifiés mais pas encore enregistrés, par id d'utilisateur. */
  drafts = signal<Record<string, string[]>>({});
  savingIds = signal<ReadonlySet<string>>(new Set());

  domainOptions = computed<SelectOption[]>(() =>
    this.domains().map(d => ({ label: d.label, value: d.code }))
  );

  private domainLabels = computed(() =>
    new Map(this.domains().map(d => [d.code, d.label]))
  );

  ngOnInit() {
    this.validationService.getDomains().subscribe({
      next: domains => this.domains.set(domains),
      error: () => {
        this.notification.error('Impossible de charger les domaines.', 'Administration');
      }
    });
  }

  isCurrentUser(user: AdminUser): boolean {
    return this.authService.currentUser()?.id === user.id;
  }

  domainLabel(code: string): string {
    return this.domainLabels().get(code) ?? code;
  }

  selectedDomains(user: AdminUser): string[] {
    return this.drafts()[user.id] ?? user.domainCodes;
  }

  isDirty(user: AdminUser): boolean {
    const draft = this.drafts()[user.id];
    return !!draft && !sameCodes(draft, user.domainCodes);
  }

  isSaving(user: AdminUser): boolean {
    return this.savingIds().has(user.id);
  }

  onDomainsChange(user: AdminUser, codes: string[] | null) {
    this.drafts.update(drafts => ({ ...drafts, [user.id]: codes ?? [] }));
  }

  onCancel(user: AdminUser) {
    this.clearDraft(user.id);
  }

  onSave(user: AdminUser) {
    const codes = this.drafts()[user.id];
    if (!codes || this.isSaving(user)) return;

    this.setSaving(user.id, true);
    this.userAdminService.replaceDomains(user.id, codes).subscribe({
      next: updated => {
        this.setSaving(user.id, false);
        this.state.replaceUser(updated);
        this.clearDraft(user.id);
        this.notification.success(`Domaines de ${updated.fullName || updated.uid} enregistrés.`, 'Administration');
      },
      error: err => {
        this.setSaving(user.id, false);
        this.notification.error(err.error?.message ?? 'Impossible d\'enregistrer les domaines.', 'Administration');
      }
    });
  }

  private clearDraft(id: string) {
    this.drafts.update(({ [id]: _, ...rest }) => rest);
  }

  private setSaving(id: string, saving: boolean) {
    this.savingIds.update(ids => {
      const next = new Set(ids);
      if (saving) next.add(id); else next.delete(id);
      return next;
    });
  }
}

function sameCodes(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every(code => b.includes(code));
}
