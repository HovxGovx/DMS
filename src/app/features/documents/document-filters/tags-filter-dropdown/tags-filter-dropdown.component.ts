import { Component, input, model, signal, computed, ElementRef, HostListener } from '@angular/core';
import { TagFilterOption } from '../../document.model';

@Component({
  selector: 'app-tags-filter-dropdown',
  standalone: true,
  templateUrl: './tags-filter-dropdown.component.html'
})
export class TagsFilterDropdownComponent {
  tagOptions = input.required<TagFilterOption[]>();
  activeTags = model<string[]>([]);

  isOpen = signal(false);

  displayLabel = computed(() => {
    const count = this.activeTags().length;
    if (count === 0) return 'Tags';
    if (count === 1) return this.activeTags()[0];
    return `Tags (${count})`;
  });

  constructor(private elementRef: ElementRef) {}

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  isActive(label: string): boolean {
    return this.activeTags().includes(label);
  }

  toggleTag(label: string) {
    const current = this.activeTags();
    this.activeTags.set(
      current.includes(label)
        ? current.filter(t => t !== label)
        : [...current, label]
    );
  }

  clearAll() {
    this.activeTags.set([]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
