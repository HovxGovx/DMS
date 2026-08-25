import { Component, inject } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';
import { ConfidenceBadgeComponent } from '../confidence-badge/confidence-badge.component';

@Component({
  selector: 'app-import-queue-list',
  standalone: true,
  imports: [],
  templateUrl: './import-queue-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class ImportQueueListComponent {
  state = inject(ValidationStateService);
  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
}
