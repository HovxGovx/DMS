import { Component, input, model, output, inject, computed, effect, signal, untracked, HostListener, ElementRef, DestroyRef, afterNextRender } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
import { DocTag, DocumentItem } from '../document.model';
import { Router } from '@angular/router';
import { DocumentUnpublishService } from '../document-unpublish.service';
import { AuthService } from '../../../core/auth.service';
import { ConfirmationService } from 'primeng/api';
import { DocumentValidationService } from '../../validation/document-validation.service';
import { SmartFolderStateService } from '../smart-folder-state.service';
import { NotificationService } from '../../../core/notification.service';
import { DocumentStatus } from '../../validation/lifecycle-document.model';
import { RELEVANCE_DISPLAY, RelevanceLevel } from '../../search/search-result.model';
import { httpErrorMessage } from '../../../core/http-error-message';

/** Lignes par page avant la première mesure, et minimum sur un écran très bas. */
const DEFAULT_ROWS = 10;
const MIN_ROWS = 3;
/** Hauteur d'une ligne (h-12 + bordure), utilisée tant qu'aucune ligne n'est affichée. */
const ROW_HEIGHT_PX = 49;
/** Un import jamais publié peut être annulé par son auteur (« Mes imports »). */
const CANCELLABLE_STATUSES: DocumentStatus[] = ['PENDING_VALIDATION', 'EXTRACTION_FAILED'];
/** Largeur du panneau des tags (w-64) et marge au bord de l'écran, en px. */
const TAGS_PANEL_WIDTH = 256;
const VIEWPORT_MARGIN = 16;
/** Tags visibles dans la cellule, le reste est résumé par le badge « +N ». */
const VISIBLE_TAGS = 2;
/** Pertinence affichée comme un indicateur à 3 barres. */
const RELEVANCE_BARS: Record<RelevanceLevel, { filled: number; color: string }> = {
  HIGH: { filled: 3, color: 'bg-emerald-500' },
  MEDIUM: { filled: 2, color: 'bg-amber-400' },
  LOW: { filled: 1, color: 'bg-gray-400' }
};

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
  protected unpublishService = inject(DocumentUnpublishService);
  protected authService = inject(AuthService);
  private confirmation = inject(ConfirmationService);
  private validationService = inject(DocumentValidationService);
  private folderState = inject(SmartFolderStateService);
  private notification = inject(NotificationService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);

  /** Import en cours d'annulation (null = aucun). */
  cancellingId = signal<string | null>(null);
  documents = input.required<DocumentItem[]>();
  selectedDocs = model<DocumentItem[]>([]);
  /** Résultats de recherche : colonne Pertinence, fichier d'origine et action "Afficher dans son dossier". */
  searchMode = input(false);
  /** Document mis en surbrillance (sélectionné, ou retrouvé via "Afficher dans son dossier"). */
  highlightedId = input<string | null>(null);

  /** Lignes par page : autant que la hauteur disponible en contient, sans défilement dans le tableau. */
  rows = signal(DEFAULT_ROWS);
  first = signal(0);

  /** Colonne Pertinence : seulement pour une recherche par mots-clés (null avec des filtres seuls). */
  showRelevance = computed(() => this.searchMode() && this.documents().some(doc => !!doc.relevance));
  columnCount = computed(() => 3 + (this.showRelevance() ? 1 : 0));

  readonly relevanceBars = [1, 2, 3];

  rowClick = output<string>();
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
        const rows = this.rows();
        const page = Math.floor(index / rows) * rows;
        if (untracked(this.first) !== page) {
          this.first.set(page);
        }
      }
    });

    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.fitRowsToHeight());
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Recalcule le nombre de lignes par page quand la hauteur du tableau change (fenêtre, bandeau affiché…). */
  private fitRowsToHeight() {
    const el = this.host.nativeElement;
    const header = el.querySelector<HTMLElement>('thead')?.offsetHeight ?? 0;
    const paginator = el.querySelector<HTMLElement>('.p-paginator')?.offsetHeight ?? 0;
    // Ligne de document uniquement : la ligne « aucun résultat » est plus haute
    const rowHeight = el.querySelector<HTMLElement>('tbody tr.doc-row')?.offsetHeight || ROW_HEIGHT_PX;
    const rows = Math.max(MIN_ROWS, Math.floor((el.clientHeight - header - paginator) / rowHeight));
    if (rows === this.rows()) return;
    this.rows.set(rows);
    // Reste sur la page qui contient la première ligne affichée jusque-là
    this.first.set(Math.floor(this.first() / rows) * rows);
  }

  /** Tags de la cellule : type du document puis tags acceptés. */
  cellTags(doc: DocumentItem): DocTag[] {
    return [{ label: doc.category, severity: doc.categorySeverity }, ...doc.tags];
  }

  visibleTags(doc: DocumentItem): DocTag[] {
    return this.cellTags(doc).slice(0, VISIBLE_TAGS);
  }

  hiddenTagCount(doc: DocumentItem): number {
    return Math.max(0, this.cellTags(doc).length - VISIBLE_TAGS);
  }

  relevanceLabel(level: RelevanceLevel): string {
    return RELEVANCE_DISPLAY[level].label;
  }

  relevanceBarColor(level: RelevanceLevel, bar: number): string {
    const { filled, color } = RELEVANCE_BARS[level];
    return bar <= filled ? color : 'bg-gray-200';
  }

  openFile(id: string) {
    this.router.navigate(['/documents', id, 'editor']);
  }

  canCancelImport(doc: DocumentItem): boolean {
    return !!doc.status && CANCELLABLE_STATUSES.includes(doc.status);
  }

  /** Supprime définitivement un import pas encore publié (fichier, texte extrait, tags). */
  cancelImport(doc: DocumentItem) {
    this.confirmation.confirm({
      header: "Annulation de l'import",
      message: `Annuler l'import de « ${doc.name} » ? Le fichier sera supprimé définitivement.`,
      icon: 'pi pi-times-circle',
      acceptIcon: 'pi pi-times',
      acceptLabel: "Annuler l'import",
      rejectLabel: 'Garder',
      accept: () => {
        this.cancellingId.set(doc.id);
        this.validationService.deleteDocument(doc.id).subscribe({
          next: () => {
            this.cancellingId.set(null);
            this.folderState.loadMyImports();
            this.notification.success(`L'import de « ${doc.name} » a été annulé.`, 'Import');
          },
          error: (err) => {
            this.cancellingId.set(null);
            this.notification.error(httpErrorMessage(err, "Impossible d'annuler l'import.", {
              409: "Cet import a été publié entre-temps : il ne peut plus être annulé.",
              404: 'Cet import a déjà été supprimé.'
            }), 'Import');
          }
        });
      }
    });
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
