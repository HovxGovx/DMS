import { Component } from '@angular/core';
import { ImportQueueListComponent } from '../import-queue-list/import-queue-list.component';
import { ImportDetailPanelComponent } from '../import-detail-panel/import-detail-panel.component';
import { IngestPanelComponent } from '../../upload/ingest-panel/ingest-panel.component';

@Component({
  selector: 'app-validation-view',
  standalone: true,
  imports: [ImportQueueListComponent, ImportDetailPanelComponent, IngestPanelComponent],
  templateUrl: './validation-view.component.html',
  host: {
    class: 'flex gap-3 flex-1 min-h-0 h-full'
  }
})
export class ValidationViewComponent {}
