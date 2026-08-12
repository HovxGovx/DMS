import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-confidence-badge',
  standalone: true,
  templateUrl: './confidence-badge.component.html'
})
export class ConfidenceBadgeComponent {
  value = input.required<number>();

  colorClasses = computed(() => {
    const v = this.value();
    if (v >= 90) return 'bg-emerald-50 text-emerald-600';
    if (v >= 75) return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-600';
  });
}