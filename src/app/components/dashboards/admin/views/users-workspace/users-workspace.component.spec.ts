import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWorkspaceComponent } from './users-workspace.component';

describe('UsersWorkspaceComponent', () => {
  let component: UsersWorkspaceComponent;
  let fixture: ComponentFixture<UsersWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
