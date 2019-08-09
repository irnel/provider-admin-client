import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetailsWorkspaceComponent } from './category-details-workspace.component';

describe('CategoryDetailsWorkspaceComponent', () => {
  let component: CategoryDetailsWorkspaceComponent;
  let fixture: ComponentFixture<CategoryDetailsWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryDetailsWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetailsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
