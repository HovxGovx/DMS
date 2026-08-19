import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewStateService {
  currentView = signal<'documents' | 'validation'>('documents');

  setView(view: 'documents' | 'validation') {
    this.currentView.set(view);
  }
}