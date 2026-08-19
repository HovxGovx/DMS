import { Component, input, model, output, signal } from '@angular/core';
import { TagFilterOption } from '../document.model';
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { TagsFilterDropdownComponent } from './tags-filter-dropdown/tags-filter-dropdown.component';

@Component({
  selector: 'app-document-filters',
  imports: [DateRangeFilterComponent, TagsFilterDropdownComponent],
  standalone: true,
  templateUrl: './document-filters.component.html'
})
export class DocumentFiltersComponent {
  dateRange = signal<Date[] | null>(null);
  dateLabel = input<string>('30 jours');
  tagOptions = input.required<TagFilterOption[]>();

  activeTags = model<string[]>([]);

  dateClick = output<void>();

  toggleTag(label: string) {
    const current = this.activeTags();
    this.activeTags.set(
      current.includes(label)
        ? current.filter(t => t !== label)
        : [...current, label]
    );
  }

  isActive(label: string): boolean {
    return this.activeTags().includes(label);
  }
}