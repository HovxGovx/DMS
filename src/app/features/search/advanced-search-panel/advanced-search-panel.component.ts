import { Component, signal, inject, ElementRef, HostListener, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../search.service';
import { DocumentStateService } from '../../documents/document-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { AdvancedSearchRequest } from '../search-request.model';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
import { FloatLabel } from 'primeng/floatlabel';

type TriState = 'any' | 'yes' | 'no';

@Component({
  selector: 'app-advanced-search-panel',
  standalone: true,
  imports: [FormsModule, DropdownBackdropComponent, FloatLabel],
  templateUrl: './advanced-search-panel.component.html'
})
export class AdvancedSearchPanelComponent {
  private searchService = inject(SearchService);
  private documentState = inject(DocumentStateService);
  private viewState = inject(ViewStateService);
  private elementRef = inject(ElementRef);
  size = input<'small' | 'large' | undefined>(undefined);
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

  // 'YYYY-MM-DD' -> début (00:00:00.000) ou fin (23:59:59.999) du jour en heure locale
  private toLocalDayBound(value: string, endOfDay: boolean): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = endOfDay
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day, 0, 0, 0, 0);
    return date.toISOString();
  }

  onSearch() {
    const request: AdvancedSearchRequest = {
      keywords: this.keywords().trim() || null,
      format: this.format().trim() || null,
      language: this.language().trim() || null,
      encrypted: this.triStateToBoolean(this.encrypted()),
      signed: this.triStateToBoolean(this.signed()),
      creationDateStart: this.startDate() ? this.toLocalDayBound(this.startDate(), false) : null,
      creationDateEnd: this.endDate() ? this.toLocalDayBound(this.endDate(), true) : null,
      fuzzy: this.fuzzy() || null
    };

    this.isSearching.set(true);

    this.searchService.searchAdvanced(request).subscribe({
      next: (results) => {
        this.isSearching.set(false);
        this.close();
        this.documentState.setSearchResults(results, request.keywords);
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
