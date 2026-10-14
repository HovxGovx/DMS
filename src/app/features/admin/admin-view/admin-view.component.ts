import { Component, OnInit, inject, signal } from '@angular/core';
import { UserDomainsPanelComponent } from '../user-domains-panel/user-domains-panel.component';
import { FailedDocumentsPanelComponent } from '../failed-documents-panel/failed-documents-panel.component';
import { OwnerlessDocumentsPanelComponent } from '../ownerless-documents-panel/ownerless-documents-panel.component';
import { IndexRebuildPanelComponent } from '../index-rebuild-panel/index-rebuild-panel.component';
import { AuditLogPanelComponent } from '../audit-log-panel/audit-log-panel.component';
import { UserAdminStateService } from '../user-admin-state.service';
import { FailedDocumentsStateService } from '../failed-documents-state.service';
import { OwnerlessDocumentsStateService } from '../ownerless-documents-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

type AdminSection = 'users' | 'failed' | 'ownerless' | 'index' | 'audit';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [UserDomainsPanelComponent, FailedDocumentsPanelComponent, OwnerlessDocumentsPanelComponent, IndexRebuildPanelComponent, AuditLogPanelComponent, ConfirmDialogComponent],
  templateUrl: './admin-view.component.html',
  host: {
    class: 'flex gap-3 flex-1 min-h-0 h-full'
  }
})
export class AdminViewComponent implements OnInit {
  userState = inject(UserAdminStateService);
  failedState = inject(FailedDocumentsStateService);
  ownerlessState = inject(OwnerlessDocumentsStateService);
  private viewState = inject(ViewStateService);

  section = signal<AdminSection>('users');

  ngOnInit() {
    // Toutes les sections sont chargées dès l'ouverture : leurs compteurs s'affichent dans le menu
    this.userState.loadUsers();
    this.failedState.loadFailed();
    this.ownerlessState.loadWithoutOwner();
  }

  onBack() {
    this.viewState.setView('documents');
  }
}
