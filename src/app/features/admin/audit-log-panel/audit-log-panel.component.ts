import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { AuditLogStateService } from '../audit-log-state.service';
import { UserAdminStateService } from '../user-admin-state.service';
import { ROLE_LABELS } from '../admin-user.model';
import { AUDIT_ACTIONS, AuditAction, auditActionDisplay, formatAuditDate } from '../../audit/audit.model';
import { SelectOption } from '../../validation/classification-select/classification-select.component';

@Component({
  selector: 'app-audit-log-panel',
  standalone: true,
  imports: [FormsModule, Select],
  templateUrl: './audit-log-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class AuditLogPanelComponent implements OnInit {
  state = inject(AuditLogStateService);
  private userState = inject(UserAdminStateService);

  readonly display = auditActionDisplay;
  readonly formatDate = formatAuditDate;

  actorOptions = computed<SelectOption[]>(() =>
    [...this.userState.users()]
      .sort((a, b) => (a.fullName || a.uid).localeCompare(b.fullName || b.uid))
      .map(u => ({ label: `${u.fullName || u.uid} — ${ROLE_LABELS[u.role]}`, value: u.id }))
  );

  actionOptions: SelectOption[] = (Object.keys(AUDIT_ACTIONS) as AuditAction[])
    .map(action => ({ label: AUDIT_ACTIONS[action].label, value: action }));

  ngOnInit() {
    // Rechargé à chaque ouverture de la section : le journal avance pendant qu'on navigue ailleurs
    this.state.load();
  }

  firstIndex(): number {
    return this.state.total() ? this.state.page() * this.state.pageSize + 1 : 0;
  }

  lastIndex(): number {
    return Math.min((this.state.page() + 1) * this.state.pageSize, this.state.total());
  }
}
