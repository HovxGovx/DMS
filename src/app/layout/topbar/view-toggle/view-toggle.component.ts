import { Component, inject } from '@angular/core';
import { ViewStateService } from '../../../core/view-state.service';
import { ValidationStateService } from '../../../features/validation/validation-state.service';

@Component({
  selector: 'app-view-toggle',
  standalone: true,
  templateUrl: './view-toggle.component.html'
})
export class ViewToggleComponent {
  viewState = inject(ViewStateService);
  validationState = inject(ValidationStateService);
}