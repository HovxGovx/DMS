import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { FolderEditorDialogComponent } from './folder-editor-dialog.component';

describe('FolderEditorDialogComponent', () => {
  let component: FolderEditorDialogComponent;
  let fixture: ComponentFixture<FolderEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderEditorDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'create');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
