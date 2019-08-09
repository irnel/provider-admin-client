import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCashierWorkspaceComponent } from './home-cashier-workspace.component';

describe('HomeCashierWorkspaceComponent', () => {
  let component: HomeCashierWorkspaceComponent;
  let fixture: ComponentFixture<HomeCashierWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCashierWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCashierWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
