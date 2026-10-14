import { Component, input, model } from '@angular/core';
import { TagFilterOption } from '../document.model';
import { TagsFilterDropdownComponent } from './tags-filter-dropdown/tags-filter-dropdown.component';

@Component({
  selector: 'app-document-filters',
  imports: [TagsFilterDropdownComponent],
  standalone: true,
  templateUrl: './document-filters.component.html'
})
export class DocumentFiltersComponent {
  tagOptions = input.required<TagFilterOption[]>();

  activeTags = model<string[]>([]);
}
