import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/documents/document-list/document-list.component')
            .then(m => m.DocumentListComponent),
      },
    ],
  },
];