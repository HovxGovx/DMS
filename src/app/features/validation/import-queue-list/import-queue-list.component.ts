import { Component, inject } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';
import { ConfidenceBadgeComponent } from '../confidence-badge/confidence-badge.component';

@Component({
  selector: 'app-import-queue-list',
  standalone: true,
  imports: [ConfidenceBadgeComponent],
  templateUrl: './import-queue-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class ImportQueueListComponent {
  state = inject(ValidationStateService);
}
