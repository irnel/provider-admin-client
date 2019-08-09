import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductWorkspaceComponent } from './edit-product-workspace.component';

describe('EditProductWorkspaceComponent', () => {
  let component: EditProductWorkspaceComponent;
  let fixture: ComponentFixture<EditProductWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
