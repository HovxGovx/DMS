import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfidenceBadgeComponent } from '../confidence-badge/confidence-badge.component';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-classification-select',
  standalone: true,
  imports: [FormsModule,
    DropdownModule,
    FloatLabel,
    ConfidenceBadgeComponent,
    Select],
  templateUrl: './classification-select.component.html'
})
export class ClassificationSelectComponent {
  label = input.required<string>();
  options = input.required<SelectOption[]>();
  confidence = input<number | null>(null);
  disabled = input<boolean>(false);
  invalid = input<boolean>(false);
  filter = input<boolean>(false);
  showClear = input<boolean>(false);

  value = model<string | null>(null);
}