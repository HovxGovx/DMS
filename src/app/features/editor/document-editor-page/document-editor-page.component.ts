import { Component, OnInit, OnDestroy, inject, signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlyOfficeScriptLoaderService } from '../onlyoffice-script-loader.service';
import { EditorConfigService } from '../editor-config.service';

@Component({
  selector: 'app-document-editor-page',
  standalone: true,
  templateUrl: './document-editor-page.component.html'
})
export class DocumentEditorPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scriptLoader = inject(OnlyOfficeScriptLoaderService);
  private configService = inject(EditorConfigService);

  editorContainer = viewChild.required<ElementRef<HTMLDivElement>>('editorContainer');

  isLoading = signal(true);
  loadError = signal<string | null>(null);

  private editorInstance: any = null;

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (!documentId) {
      this.loadError.set("Identifiant de document manquant.");
      this.isLoading.set(false);
      return;
    }

    this.scriptLoader.load()
      .then(() => this.configService.getConfig(documentId).toPromise())
      .then((config) => {
        this.isLoading.set(false);
        this.editorInstance = new window.DocsAPI.DocEditor(
          this.editorInstance = new window.DocsAPI.DocEditor(
            'documentEditorPlaceholder',
            config
        )
      );
      })
      .catch((err) => {
        this.isLoading.set(false);
        this.loadError.set("Impossible de charger l'éditeur de document.");
        console.error('Erreur chargement éditeur:', err);
      });
  }

  ngOnDestroy() {
    if (this.editorInstance?.destroyEditor) {
      this.editorInstance.destroyEditor();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}