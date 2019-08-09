import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsWorkspaceComponent } from './order-details-workspace.component';

describe('OrderDetailsWorkspaceComponent', () => {
  let component: OrderDetailsWorkspaceComponent;
  let fixture: ComponentFixture<OrderDetailsWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
