import { Component, signal, computed, model, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

type QuickPreset = { label: string; days: number };

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-range-filter.component.html'
})
export class DateRangeFilterComponent {
  range = model<Date[] | null>(null);

  isOpen = signal(false);
  activePresetLabel = signal<string | null>('30 derniers jours');

  startDate = signal<string>('');
  endDate = signal<string>('');

  presets: QuickPreset[] = [
    { label: "Aujourd'hui", days: 0 },
    { label: '7 derniers jours', days: 7 },
    { label: '30 derniers jours', days: 30 },
    { label: '90 derniers jours', days: 90 }
  ];

  displayLabel = computed(() => {
    if (this.activePresetLabel()) return this.activePresetLabel()!;
    const r = this.range();
    if (r && r[0] && r[1]) {
      return `${this.formatDate(r[0])} → ${this.formatDate(r[1])}`;
    }
    return 'Toutes les dates';
  });

  // La plage est valable seulement si les 2 dates sont remplies ET dans le bon ordre
  isRangeValid = computed(() => {
    if (!this.startDate() || !this.endDate()) return false;
    return new Date(this.startDate()) <= new Date(this.endDate());
  });

  canApply = computed(() => this.isRangeValid());

  // Empêche de choisir une date de fin avant la date de début (attribut [min] du champ)
  minEndDate = computed(() => this.startDate() || null);

  // Empêche de choisir une date de début après la date de fin (attribut [max] du champ)
  maxStartDate = computed(() => this.endDate() || null);

  showOrderError = computed(() =>
    !!this.startDate() && !!this.endDate() && !this.isRangeValid()
  );

  constructor(private elementRef: ElementRef) {}

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  selectPreset(preset: QuickPreset) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - preset.days);

    this.activePresetLabel.set(preset.label);
    this.range.set([start, end]);
    this.startDate.set('');
    this.endDate.set('');
    this.close();
  }

  applyCustomRange() {
    if (!this.canApply()) return;

    const start = new Date(this.startDate());
    const end = new Date(this.endDate());

    this.activePresetLabel.set(null);
    this.range.set([start, end]);
    this.close();
  }

  clear() {
    this.activePresetLabel.set(null);
    this.range.set(null);
    this.startDate.set('');
    this.endDate.set('');
    this.close();
  }

  private formatDate(d: Date): string {
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}