import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssueModalComponent } from './create-issue-modal.component';

describe('CreateIssueModalComponent', () => {
  let component: CreateIssueModalComponent;
  let fixture: ComponentFixture<CreateIssueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIssueModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
