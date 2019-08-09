import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWorkspaceComponent } from './category-workspace.component';

describe('CategoryWorkspaceComponent', () => {
  let component: CategoryWorkspaceComponent;
  let fixture: ComponentFixture<CategoryWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
