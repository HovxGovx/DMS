import { Component, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AdminIndexService } from '../admin-index.service';
import { IndexRebuildStateService } from '../index-rebuild-state.service';
import { NotificationService } from '../../../core/notification.service';
import { httpErrorMessage } from '../../../core/http-error-message';

@Component({
  selector: 'app-index-rebuild-panel',
  standalone: true,
  templateUrl: './index-rebuild-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class IndexRebuildPanelComponent {
  state = inject(IndexRebuildStateService);
  private indexService = inject(AdminIndexService);
  private notification = inject(NotificationService);
  private confirmation = inject(ConfirmationService);

  formatDuration(ms: number): string {
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} s`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  onRebuild() {
    if (this.state.isRebuilding()) return;

    this.confirmation.confirm({
      header: "Reconstruction de l'index",
      message: "Réindexer tous les documents publiés ? La recherche continue de fonctionner pendant l'opération.",
      icon: 'pi pi-refresh',
      acceptLabel: 'Reconstruire',
      rejectLabel: 'Annuler',
      accept: () => this.rebuild()
    });
  }

  private rebuild() {
    this.state.isRebuilding.set(true);
    this.indexService.rebuild().subscribe({
      next: result => {
        this.state.isRebuilding.set(false);
        this.state.lastResult.set({ result, at: new Date() });
        if (result.failures.length) {
          this.notification.error(
            `${result.failures.length} document(s) n'ont pas pu être indexés.`, 'Administration');
        } else {
          this.notification.success(`Index reconstruit : ${result.indexed} documents.`, 'Administration');
        }
      },
      error: err => {
        this.state.isRebuilding.set(false);
        this.notification.error(httpErrorMessage(err, "La reconstruction de l'index a échoué.", {
          409: "Une reconstruction de l'index est déjà en cours."
        }), 'Administration');
      }
    });
  }
}
