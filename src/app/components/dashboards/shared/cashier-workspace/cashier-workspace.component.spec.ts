import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierWorkspaceComponent } from './cashier-workspace.component';

describe('CashierWorkspaceComponent', () => {
  let component: CashierWorkspaceComponent;
  let fixture: ComponentFixture<CashierWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
