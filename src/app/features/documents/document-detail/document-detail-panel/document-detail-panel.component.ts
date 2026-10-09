import { Component, inject, input } from '@angular/core';
import { DocumentInfoCardComponent } from '../document-info-card/document-info-card.component';
import { DocumentMetadataSectionComponent } from '../document-metadata-section/document-metadata-section.component';
import { DocumentDetail } from '../../document.model';
import { DocumentLocationService } from '../../document-location.service';

@Component({
  selector: 'app-document-detail-panel',
  standalone: true,
  imports: [DocumentInfoCardComponent, DocumentMetadataSectionComponent],
  templateUrl: './document-detail-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class DocumentDetailPanelComponent {
  private locationService = inject(DocumentLocationService);

  document = input.required<DocumentDetail>();

  revealInFolder() {
    this.locationService.revealInFolder(this.document().docId);
  }
}
