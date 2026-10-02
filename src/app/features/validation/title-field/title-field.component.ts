import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-title-field',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabel
  ],
  templateUrl: './title-field.component.html'
})
export class TitleFieldComponent {
  label = input<string>('Titre suggéré');

  inputId = input<string>('title-field');
  placeholder = input<string>('');
  size = input<'small' | 'large' | undefined>(undefined);
  invalid = input<boolean>(false);
  originalValue = input<string>('');
  value = model.required<string>();

  reset() {
    this.value.set(this.originalValue());
  }
}