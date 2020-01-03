import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailAddressComponent } from './confirm-email-address.component';

describe('ConfirmEmailAddressComponent', () => {
  let component: ConfirmEmailAddressComponent;
  let fixture: ComponentFixture<ConfirmEmailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEmailAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
