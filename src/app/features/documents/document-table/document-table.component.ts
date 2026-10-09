import { Component, input, model, output, inject, effect, signal, untracked, HostListener } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
import { DocumentItem } from '../document.model';
import { Router } from '@angular/router';

const ROWS_PER_PAGE = 4;
/** Largeur du panneau des tags (w-64) et marge au bord de l'écran, en px. */
const TAGS_PANEL_WIDTH = 256;
const VIEWPORT_MARGIN = 16;

@Component({
  selector: 'app-document-table',
  standalone: true,
  imports: [TableModule, TagModule, TooltipModule, DropdownBackdropComponent],
  templateUrl: './document-table.component.html',
  host: {
    class: 'flex flex-col h-full min-h-0'
  }

})
export class DocumentTableComponent {
  private router = inject(Router);
  documents = input.required<DocumentItem[]>();
  selectedDocs = model<DocumentItem[]>([]);
  /** Affiche la colonne Emplacement et l'action "Afficher dans son dossier" (résultats de recherche). */
  showLocation = input(false);
  /** Document mis en surbrillance (sélectionné, ou retrouvé via "Afficher dans son dossier"). */
  highlightedId = input<string | null>(null);

  rows = ROWS_PER_PAGE;
  first = signal(0);

  rowClick = output<string>();
  editMetadata = output<string>();
  revealInFolder = output<string>();

  /** Document dont on affiche tous les tags (null = panneau fermé). */
  tagsDoc = signal<DocumentItem | null>(null);
  /** Dernier document affiché : garde le contenu pendant l'animation de fermeture. */
  lastTagsDoc = signal<DocumentItem | null>(null);
  tagsPosition = signal<{ top: number | null; bottom: number | null; left: number }>({ top: 0, bottom: null, left: 0 });

  constructor() {
    // Amène la page du tableau sur le document mis en surbrillance quand il apparaît dans la liste
    effect(() => {
      const id = this.highlightedId();
      const docs = this.documents();
      const index = id ? docs.findIndex(doc => doc.id === id) : -1;
      if (index >= 0) {
        const page = Math.floor(index / this.rows) * this.rows;
        if (untracked(this.first) !== page) {
          this.first.set(page);
        }
      }
    });
  }

  openFile(id: string) {
    this.router.navigate(['/documents', id, 'editor']);
  }

  openTags(doc: DocumentItem, event: MouseEvent) {
    // Ne sélectionne pas la ligne et ne déclenche pas la fermeture sur document:click
    event.stopPropagation();
    if (this.tagsDoc()?.id === doc.id) {
      this.closeTags();
      return;
    }
    // Position fixe : le conteneur du tableau couperait un panneau en position absolue
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, window.innerWidth - TAGS_PANEL_WIDTH - VIEWPORT_MARGIN));
    const openUp = rect.bottom > window.innerHeight * 0.65;
    this.tagsPosition.set(openUp
      ? { top: null, bottom: window.innerHeight - rect.top + 4, left }
      : { top: rect.bottom + 4, bottom: null, left });
    this.lastTagsDoc.set(doc);
    this.tagsDoc.set(doc);
  }

  closeTags() {
    this.tagsDoc.set(null);
  }

  // Ferme le panneau des tags sur un clic ailleurs, Échap ou redimensionnement
  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  @HostListener('window:resize')
  onOutsideInteraction() {
    if (this.tagsDoc()) {
      this.closeTags();
    }
  }
}
