import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDetailsWorkspaceComponent } from './provider-details-workspace.component';

describe('ProviderDetailsWorkspaceComponent', () => {
  let component: ProviderDetailsWorkspaceComponent;
  let fixture: ComponentFixture<ProviderDetailsWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderDetailsWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
