import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-classification-select',
  standalone: true,
  imports: [FormsModule, FloatLabel, Select],
  templateUrl: './classification-select.component.html'
})
export class ClassificationSelectComponent {
  label = input.required<string>();
  options = input.required<SelectOption[]>();
  disabled = input<boolean>(false);

  value = model<string | null>(null);
}