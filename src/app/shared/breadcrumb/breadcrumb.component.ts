import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  segments = input.required<string[]>();
  segmentClick = output<string>();
}