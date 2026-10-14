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
  publishDisabled = input<boolean>(false);
  isPublishing = input<boolean>(false);
  /** Ce qui empêche de publier (champ manquant), affiché à côté du bouton. */
  blocker = input<string | null>(null);
  resetDisabled = input<boolean>(true);
  deleteDisabled = input<boolean>(false);

  resetClick = output<void>();
  publishClick = output<void>();
  deleteClick = output<void>();
}
