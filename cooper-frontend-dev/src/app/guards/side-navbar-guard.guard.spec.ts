import { TestBed } from '@angular/core/testing';

import { SideNavbarGuardGuard } from './side-navbar-guard.guard';

describe('SideNavbarGuardGuard', () => {
  let guard: SideNavbarGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SideNavbarGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
