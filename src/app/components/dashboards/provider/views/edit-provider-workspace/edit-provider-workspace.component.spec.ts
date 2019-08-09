import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProviderWorkspaceComponent } from './edit-provider-workspace.component';

describe('EditProviderWorkspaceComponent', () => {
  let component: EditProviderWorkspaceComponent;
  let fixture: ComponentFixture<EditProviderWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProviderWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProviderWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
