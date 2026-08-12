import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { DocumentListComponent } from './features/documents/document-list/document-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: DocumentListComponent }
    ]
  }
];