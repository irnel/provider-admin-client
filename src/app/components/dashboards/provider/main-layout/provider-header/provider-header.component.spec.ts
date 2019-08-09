import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderHeaderComponent } from './provider-header.component';

describe('ProviderHeaderComponent', () => {
  let component: ProviderHeaderComponent;
  let fixture: ComponentFixture<ProviderHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
