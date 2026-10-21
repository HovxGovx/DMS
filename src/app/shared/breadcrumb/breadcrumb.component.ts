import { Component, input, output } from '@angular/core';

/** Un segment du fil d'Ariane ; id null : simple libellé (résultats de recherche, racine). */
export interface BreadcrumbSegment {
  id: string | null;
  label: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  segments = input.required<BreadcrumbSegment[]>();
  /** Émet l'id du dossier : deux dossiers du chemin peuvent porter le même nom. */
  segmentClick = output<string>();
}
