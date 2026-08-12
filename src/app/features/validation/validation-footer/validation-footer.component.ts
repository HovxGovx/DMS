import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-validation-footer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './validation-footer.component.html'
})
export class ValidationFooterComponent {
  remainingCount = input.required<number>();

  cancelClick = output<void>();
  validateClick = output<void>();
}