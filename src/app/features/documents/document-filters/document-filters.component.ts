import { Component, input, model, output } from '@angular/core';
import { TagFilterOption } from '../document.model';

@Component({
  selector: 'app-document-filters',
  standalone: true,
  templateUrl: './document-filters.component.html'
})
export class DocumentFiltersComponent {
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