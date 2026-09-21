import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dropdown-backdrop',
  standalone: true,
  templateUrl: './dropdown-backdrop.component.html'
})
export class DropdownBackdropComponent {
  visible = input.required<boolean>();
}
