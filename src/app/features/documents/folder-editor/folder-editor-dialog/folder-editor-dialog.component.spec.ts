import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderEditorDialogComponent } from './folder-editor-dialog.component';

describe('FolderEditorDialogComponent', () => {
  let component: FolderEditorDialogComponent;
  let fixture: ComponentFixture<FolderEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderEditorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
