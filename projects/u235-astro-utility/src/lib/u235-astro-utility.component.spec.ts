import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { U235AstroUtilityComponent } from './u235-astro-utility.component';

describe('U235AstroUtilityComponent', () => {
  let component: U235AstroUtilityComponent;
  let fixture: ComponentFixture<U235AstroUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ U235AstroUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(U235AstroUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
