import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashierWorkspaceComponent } from './edit-cashier-workspace.component';

describe('EditCashierWorkspaceComponent', () => {
  let component: EditCashierWorkspaceComponent;
  let fixture: ComponentFixture<EditCashierWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCashierWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCashierWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
