import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DocsEditorConfig } from './editor-config.service';

/** Seule partie de l'éditeur OnlyOffice utilisée par l'application. */
export interface DocEditor {
  destroyEditor(): void;
}

declare global {
  interface Window {
    // Défini par api.js une fois le script chargé
    DocsAPI?: {
      DocEditor: new (placeholderId: string, config: DocsEditorConfig) => DocEditor;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class OnlyOfficeScriptLoaderService {
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (window.DocsAPI) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${environment.onlyOfficeUrl}/web-apps/apps/api/documents/api.js`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossible de charger le script OnlyOffice."));
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}