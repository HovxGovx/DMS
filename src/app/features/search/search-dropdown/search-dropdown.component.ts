import { Component, signal, inject, ElementRef, HostListener, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../search.service';
import { SearchResult } from '../search-result.model';
import { detectFileType } from '../../documents/document.mapper';
import { DocumentStateService } from '../../documents/document-state.service';
import { ViewStateService } from '../../../core/view-state.service';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './search-dropdown.component.html'
})
export class SearchDropdownComponent {
  private searchService = inject(SearchService);
  private documentState = inject(DocumentStateService);
  private viewState = inject(ViewStateService);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  query = signal('');
  results = signal<SearchResult[]>([]);
  isOpen = signal(false);
  isLoading = signal(false);
  hasSearched = signal(false);

  private query$ = new Subject<string>();

  constructor() {
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => q.trim().length >= 2),
      switchMap(q => {
        this.isLoading.set(true);
        return this.searchService.searchSimple(q);
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

  selectResult(result: SearchResult) {
    this.isOpen.set(false);
    this.query.set('');
    this.results.set([]);
    this.hasSearched.set(false);

    this.viewState.setView('documents');
    this.documentState.selectDocument(result.id);
  }

  close() {
    this.isOpen.set(false);
  }

  iconFor(fileName: string) {
    return detectFileType(fileName);
  }

  scorePercent(score: number): number {
    return Math.round(score * 100);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}