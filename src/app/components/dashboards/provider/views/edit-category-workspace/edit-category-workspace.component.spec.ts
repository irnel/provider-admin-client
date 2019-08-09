import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryWorkspaceComponent } from './edit-category-workspace.component';

describe('EditCategoryWorkspaceComponent', () => {
  let component: EditCategoryWorkspaceComponent;
  let fixture: ComponentFixture<EditCategoryWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
