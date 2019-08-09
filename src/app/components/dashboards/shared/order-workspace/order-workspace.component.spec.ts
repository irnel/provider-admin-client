import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWorkspaceComponent } from './order-workspace.component';

describe('OrderWorkspaceComponent', () => {
  let component: OrderWorkspaceComponent;
  let fixture: ComponentFixture<OrderWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
