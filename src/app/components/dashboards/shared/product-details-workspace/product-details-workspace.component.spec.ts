import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsWorkspaceComponent } from './product-details-workspace.component';

describe('ProductDetailsWorkspaceComponent', () => {
  let component: ProductDetailsWorkspaceComponent;
  let fixture: ComponentFixture<ProductDetailsWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
