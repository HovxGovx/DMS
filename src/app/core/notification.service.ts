import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageService = inject(MessageService);

  success(message: string, title = 'Succès') {
    this.messageService.add({ severity: 'success', summary: title, detail: message, life: 4000 });
  }

  error(message: string, title = 'Erreur') {
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 6000 });
  }

  warn(message: string, title = 'Attention') {
    this.messageService.add({ severity: 'warn', summary: title, detail: message, life: 5000 });
  }

  info(message: string, title = 'Info') {
    this.messageService.add({ severity: 'info', summary: title, detail: message, life: 4000 });
  }
}