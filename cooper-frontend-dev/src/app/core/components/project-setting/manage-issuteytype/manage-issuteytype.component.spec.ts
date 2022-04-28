import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIssuteytypeComponent } from './manage-issuteytype.component';

describe('ManageIssuteytypeComponent', () => {
  let component: ManageIssuteytypeComponent;
  let fixture: ComponentFixture<ManageIssuteytypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIssuteytypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIssuteytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
