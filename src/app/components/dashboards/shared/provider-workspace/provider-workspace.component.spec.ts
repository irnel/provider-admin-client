import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderWorkspaceComponent } from './provider-workspace.component';

describe('ProviderWorkspaceComponent', () => {
  let component: ProviderWorkspaceComponent;
  let fixture: ComponentFixture<ProviderWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
