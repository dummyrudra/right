import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePeopleOrgComponent } from './manage-people-org.component';

describe('ManagePeopleOrgComponent', () => {
  let component: ManagePeopleOrgComponent;
  let fixture: ComponentFixture<ManagePeopleOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePeopleOrgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePeopleOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
