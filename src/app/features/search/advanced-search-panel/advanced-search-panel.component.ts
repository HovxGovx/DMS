import { Component, signal, inject, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../search.service';
import { DocumentStateService } from '../../documents/document-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { AdvancedSearchRequest } from '../search-request.model';

type TriState = 'any' | 'yes' | 'no';

@Component({
  selector: 'app-advanced-search-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './advanced-search-panel.component.html'
})
export class AdvancedSearchPanelComponent {
  private searchService = inject(SearchService);
  private documentState = inject(DocumentStateService);
  private viewState = inject(ViewStateService);
  private elementRef = inject(ElementRef);

  isOpen = signal(false);
  isSearching = signal(false);

  keywords = signal('');
  format = signal('');
  language = signal('');
  encrypted = signal<TriState>('any');
  signed = signal<TriState>('any');
  startDate = signal('');
  endDate = signal('');
  fuzzy = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  private triStateToBoolean(value: TriState): boolean | null {
    if (value === 'yes') return true;
    if (value === 'no') return false;
    return null;
  }

  onSearch() {
    const request: AdvancedSearchRequest = {
      keywords: this.keywords().trim() || null,
      format: this.format().trim() || null,
      language: this.language().trim() || null,
      encrypted: this.triStateToBoolean(this.encrypted()),
      signed: this.triStateToBoolean(this.signed()),
      creationDateStart: this.startDate() ? new Date(this.startDate()).toISOString() : null,
      creationDateEnd: this.endDate() ? new Date(this.endDate()).toISOString() : null,
      fuzzy: this.fuzzy() || null
    };

    this.isSearching.set(true);

    this.searchService.searchAdvanced(request).subscribe({
      next: (results) => {
        this.isSearching.set(false);
        this.close();
        this.documentState.setSearchResults(results);
        this.viewState.setView('documents');
      },
      error: (err) => {
        this.isSearching.set(false);
        console.error('Erreur recherche avancée:', err);
      }
    });
  }

  reset() {
    this.keywords.set('');
    this.format.set('');
    this.language.set('');
    this.encrypted.set('any');
    this.signed.set('any');
    this.startDate.set('');
    this.endDate.set('');
    this.fuzzy.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}