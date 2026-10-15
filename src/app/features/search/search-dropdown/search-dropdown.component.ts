import { Component, signal, inject, ElementRef, HostListener, DestroyRef, effect, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../search.service';
import { RELEVANCE_DISPLAY, SearchResult } from '../search-result.model';
import { activeFilterCount, NO_FILTERS, SearchFilters, toSearchRequest } from '../search-request.model';
import { detectFileType } from '../../documents/document.mapper';
import { DocumentStateService } from '../../documents/document-state.service';
import { DocumentLocationService } from '../../documents/document-location.service';
import { locationOf } from '../../documents/document.model';
import { ViewStateService } from '../../../core/view-state.service';
import { AdvancedSearchPanelComponent } from '../advanced-search-panel/advanced-search-panel.component';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AdvancedSearchPanelComponent,
    InputGroup, InputGroupAddon
  ],
  templateUrl: './search-dropdown.component.html'
})
/** La recherche unique de l'interface : la barre (tolérante aux fautes) et ses filtres, qui l'affinent. */
export class SearchDropdownComponent {
  private searchService = inject(SearchService);
  private documentState = inject(DocumentStateService);
  private viewState = inject(ViewStateService);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private locationService = inject(DocumentLocationService);

  query = signal('');
  results = signal<SearchResult[]>([]);
  isOpen = signal(false);
  isLoading = signal(false);
  hasSearched = signal(false);
  filters = signal<SearchFilters>(NO_FILTERS);

  private query$ = new Subject<string>();

  constructor() {
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => q.trim().length >= 2),
      switchMap(q => {
        this.isLoading.set(true);
        return this.searchService.search(toSearchRequest(q, this.filters()));
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (results) => {
        this.results.set(results);
        this.isLoading.set(false);
        this.hasSearched.set(true);
        this.isOpen.set(true);
      },
      error: () => {
        this.results.set([]);
        this.isLoading.set(false);
        this.hasSearched.set(true);
        this.isOpen.set(true);
      }
    });

    // Quitter les résultats (dossier, « effacer la recherche ») termine la recherche : la barre et les filtres repartent à vide
    effect(() => {
      if (!this.documentState.isSearchMode()) {
        untracked(() => {
          this.reset();
          this.filters.set(NO_FILTERS);
        });
      }
    });
  }

  onInput(value: string) {
    this.query.set(value);

    if (value.trim().length < 2) {
      this.results.set([]);
      this.hasSearched.set(false);
      this.isOpen.set(false);
      return;
    }

    this.query$.next(value);
  }

  onFocus() {
    if (this.results().length > 0) {
      this.isOpen.set(true);
    }
  }

  /** Ouvre le document dans son dossier (par domaine et par type) et le sélectionne. */
  selectResult(result: SearchResult) {
    this.reset();
    this.locationService.revealInFolder(result.id);
  }

  /** Affiche tous les résultats dans le tableau ; la saisie reste dans la barre pour pouvoir l'affiner avec les filtres. */
  showAllResults() {
    const label = this.query().trim();
    const results = this.results();
    if (label.length < 2 || !this.hasSearched()) return;
    this.close();
    this.viewState.setView('documents');
    this.documentState.setSearchResults(results, label);
  }

  /** Applique les filtres à la saisie de la barre (ou seuls, sans mots-clés) et affiche les résultats dans le tableau. */
  onApplyFilters(filters: SearchFilters) {
    this.filters.set(filters);
    const keywords = this.query().trim();
    if (!keywords && activeFilterCount(filters) === 0) {
      this.documentState.clearSearch();
      return;
    }

    this.searchService.search(toSearchRequest(keywords, filters)).subscribe({
      next: (results) => {
        if (keywords.length >= 2) {
          this.results.set(results);
          this.hasSearched.set(true);
        }
        this.viewState.setView('documents');
        this.documentState.setSearchResults(results, keywords || null);
      },
      error: (err) => console.error('Erreur recherche :', err)
    });
  }

  locationLabel(result: SearchResult): string {
    return locationOf(result.domainLabel, result.typeLabel).join(' › ');
  }

  private reset() {
    this.isOpen.set(false);
    this.query.set('');
    this.results.set([]);
    this.hasSearched.set(false);
  }

  close() {
    this.isOpen.set(false);
  }

  iconFor(fileName: string) {
    return detectFileType(fileName);
  }

  relevanceLabel(result: SearchResult): string {
    return result.relevance ? RELEVANCE_DISPLAY[result.relevance].label : '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
