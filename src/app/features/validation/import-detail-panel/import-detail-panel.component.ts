import { Component, inject } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';

@Component({
  selector: 'app-import-detail-panel',
  standalone: true,
  templateUrl: './import-detail-panel.component.html',
  host: {
    class: 'flex-1 bg-white rounded-xl border border-prussian-blue-100 p-6 flex flex-col min-h-0'
  }
})
export class ImportDetailPanelComponent {
  state = inject(ValidationStateService);

  onPublish() {
    const id = this.state.selectedImportId();
    if (id) {
      this.state.publish(id);
    }
  }
}
