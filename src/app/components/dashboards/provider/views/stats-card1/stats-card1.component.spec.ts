import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCard1Component } from './stats-card1.component';

describe('StatsCard1Component', () => {
  let component: StatsCard1Component;
  let fixture: ComponentFixture<StatsCard1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsCard1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsCard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
