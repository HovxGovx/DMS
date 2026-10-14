import { Component } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';

/**
 * Boîte de confirmation des suppressions, à placer une fois dans chaque vue.
 * Elle affiche les demandes faites via ConfirmationService.confirm().
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ConfirmDialog],
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent { }
