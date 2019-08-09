import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierHeaderComponent } from './cashier-header.component';

describe('CashierHeaderComponent', () => {
  let component: CashierHeaderComponent;
  let fixture: ComponentFixture<CashierHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
