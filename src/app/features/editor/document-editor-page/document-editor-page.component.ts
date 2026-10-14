import { Component, OnInit, OnDestroy, inject, signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocEditor, OnlyOfficeScriptLoaderService } from '../onlyoffice-script-loader.service';
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

  private editorInstance: DocEditor | null = null;

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (!documentId) {
      this.loadError.set("Identifiant de document manquant.");
      this.isLoading.set(false);
      return;
    }

    this.scriptLoader.load()
      .then(() => firstValueFrom(this.configService.getConfig(documentId)))
      .then((config) => {
        this.isLoading.set(false);
        // load() n'aboutit qu'une fois api.js chargé, qui définit DocsAPI
        this.editorInstance = new window.DocsAPI!.DocEditor('documentEditorPlaceholder', config);
      })
      .catch(() => {
        this.isLoading.set(false);
        this.loadError.set("Impossible de charger l'éditeur de document.");
      });
  }

  ngOnDestroy() {
    this.editorInstance?.destroyEditor();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}