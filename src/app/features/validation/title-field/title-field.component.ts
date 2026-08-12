import { UpperCasePipe } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-title-field',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './title-field.component.html'
})
export class TitleFieldComponent {
  label = input<string>('Titre suggéré');
  value = model.required<string>();
}