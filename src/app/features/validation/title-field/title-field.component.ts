import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-title-field',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    FloatLabel
  ],
  templateUrl: './title-field.component.html'
})
export class TitleFieldComponent {
  label = input<string>('Titre');

  inputId = input<string>('title-field');
  value = model.required<string>();
}