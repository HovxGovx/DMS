import { Component, signal, inject, ElementRef, HostListener, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { activeFilterCount, NO_FILTERS, SearchFilters } from '../search-request.model';
import { DropdownBackdropComponent } from '../../../shared/dropdown-backdrop/dropdown-backdrop.component';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';

/**
 * Filtres de la recherche : ils affinent les mots-clés saisis dans la barre (pas de second champ de recherche).
 * Le panneau édite un brouillon ; la recherche est relancée par la barre quand on applique.
 */
@Component({
  selector: 'app-advanced-search-panel',
  standalone: true,
  // InputText pose la classe p-filled : sans elle, le libellé redescend dans un champ rempli
  imports: [FormsModule, DropdownBackdropComponent, FloatLabel, InputText],
  templateUrl: './advanced-search-panel.component.html'
})
export class AdvancedSearchPanelComponent {
  private elementRef = inject(ElementRef);
  size = input<'small' | 'large' | undefined>(undefined);
  /** Filtres actuellement appliqués à la recherche. */
  filters = input.required<SearchFilters>();
  apply = output<SearchFilters>();

  isOpen = signal(false);
  activeCount = computed(() => activeFilterCount(this.filters()));

  format = signal('');
  language = signal('');
  startDate = signal('');
  endDate = signal('');

  toggle() {
    if (!this.isOpen()) {
      this.loadDraft(this.filters());
    }
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  onApply() {
    this.apply.emit({
      format: this.format(),
      language: this.language(),
      startDate: this.startDate(),
      endDate: this.endDate()
    });
    this.close();
  }

  reset() {
    this.loadDraft(NO_FILTERS);
  }

  private loadDraft(filters: SearchFilters) {
    this.format.set(filters.format);
    this.language.set(filters.language);
    this.startDate.set(filters.startDate);
    this.endDate.set(filters.endDate);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
