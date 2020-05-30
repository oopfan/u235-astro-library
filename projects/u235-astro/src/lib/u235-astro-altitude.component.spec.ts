import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { U235AstroAltitudeComponent } from './u235-astro-altitude.component';

describe('U235AstroComponent', () => {
  let component: U235AstroAltitudeComponent;
  let fixture: ComponentFixture<U235AstroAltitudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ U235AstroAltitudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(U235AstroAltitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
