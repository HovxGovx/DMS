import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { DocumentListComponent } from './features/documents/document-list/document-list.component';
import { AuthPageComponent } from './features/auth/auth-page/auth-page.component';
import { DocumentEditorPageComponent } from './features/editor/document-editor-page/document-editor-page.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent },
  {
    path: 'documents/:id/editor',
    component: DocumentEditorPageComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DocumentListComponent }
    ]
  }
];