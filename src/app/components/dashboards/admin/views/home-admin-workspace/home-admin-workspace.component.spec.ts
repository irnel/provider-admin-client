import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdminWorkspaceComponent } from './home-admin-workspace.component';

describe('HomeAdminWorkspaceComponent', () => {
  let component: HomeAdminWorkspaceComponent;
  let fixture: ComponentFixture<HomeAdminWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAdminWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAdminWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
