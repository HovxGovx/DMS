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

type AdminSection = 'users' | 'failed' | 'ownerless' | 'index' | 'audit';

interface AdminSectionItem {
  id: AdminSection;
  label: string;
  hint: string;
  icon: string;
}

const SECTIONS: AdminSectionItem[] = [
  { id: 'users', label: 'Utilisateurs et domaines', hint: 'Accès des utilisateurs par domaine', icon: 'pi-users' },
  { id: 'failed', label: 'Documents en échec', hint: 'Extraction ou indexation à relancer', icon: 'pi-exclamation-circle' },
  { id: 'ownerless', label: 'Sans propriétaire', hint: 'Documents à rattacher à un utilisateur', icon: 'pi-user-minus' },
  { id: 'index', label: 'Index de recherche', hint: "Reconstruction de l'index", icon: 'pi-search' },
  { id: 'audit', label: "Journal d'audit", hint: 'Historique des actions', icon: 'pi-history' }
];

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [UserDomainsPanelComponent, FailedDocumentsPanelComponent, OwnerlessDocumentsPanelComponent, IndexRebuildPanelComponent, AuditLogPanelComponent],
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

  readonly sections = SECTIONS;
  section = signal<AdminSection>('users');

  ngOnInit() {
    // Toutes les sections sont chargées dès l'ouverture : leurs compteurs s'affichent dans le menu
    this.userState.loadUsers();
    this.failedState.loadFailed();
    this.ownerlessState.loadWithoutOwner();
  }

  /** Compteur affiché à droite de la section ; 0 le masque. */
  count(id: AdminSection): number {
    switch (id) {
      case 'users': return this.userState.withoutDomainCount();
      case 'failed': return this.failedState.count();
      case 'ownerless': return this.ownerlessState.count();
      default: return 0;
    }
  }

  onBack() {
    this.viewState.setView('documents');
  }
}
