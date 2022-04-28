import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListViewComponent } from './board-list-view.component';

describe('BoardListViewComponent', () => {
  let component: BoardListViewComponent;
  let fixture: ComponentFixture<BoardListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
