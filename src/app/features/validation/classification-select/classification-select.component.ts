import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfidenceBadgeComponent } from '../confidence-badge/confidence-badge.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-classification-select',
  standalone: true,
  imports: [FormsModule, DropdownModule,UpperCasePipe ,ConfidenceBadgeComponent],
  templateUrl: './classification-select.component.html'
})
export class ClassificationSelectComponent {
  label = input.required<string>();
  options = input.required<string[]>();
  confidence = input.required<number>();

  value = model.required<string>();
}