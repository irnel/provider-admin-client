import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWorkspaceComponent } from './product-workspace.component';

describe('ProductWorkspaceComponent', () => {
  let component: ProductWorkspaceComponent;
  let fixture: ComponentFixture<ProductWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
