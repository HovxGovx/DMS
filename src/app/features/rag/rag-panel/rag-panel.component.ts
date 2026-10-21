import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MAX_QUESTION_LENGTH, RagStateService } from '../rag-state.service';
import { RagSource } from '../rag.model';
import { DocumentLocationService } from '../../documents/document-location.service';

/**
 * Questions en langage courant sur les documents, au-dessus de la liste. Une source ouvre le dossier du document
 * et l'affiche dans le panneau de détails.
 */
@Component({
  selector: 'app-rag-panel',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  templateUrl: './rag-panel.component.html'
})
export class RagPanelComponent {
  state = inject(RagStateService);
  private locationService = inject(DocumentLocationService);

  readonly maxLength = MAX_QUESTION_LENGTH;
  question = signal('');

  onAsk() {
    this.state.ask(this.question());
  }

  onSourceClick(source: RagSource) {
    this.locationService.revealInFolder(source.documentId);
  }
}
