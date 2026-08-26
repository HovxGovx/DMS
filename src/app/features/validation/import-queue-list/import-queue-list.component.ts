import { Component, inject, OnInit } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-import-queue-list',
  standalone: true,
  imports: [TableModule],
  templateUrl: './import-queue-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class ImportQueueListComponent implements OnInit {
  state = inject(ValidationStateService);

  ngOnInit() {
    this.state.loadPendingImports();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
}