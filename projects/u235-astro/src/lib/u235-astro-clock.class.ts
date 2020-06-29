import { Observable, throwError } from 'rxjs';
import { map, refCount, publishReplay } from 'rxjs/operators';
import { U235AstroClockTick } from './u235-astro.interfaces';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';
import { U235AstroEllipticalOrbit } from './u235-astro-elliptical-orbit.class';

export class U235AstroClock {

  // Inputs:
  date$: Observable<Date>;

  // Outputs:
  clockTick$: Observable<U235AstroClockTick>;

  // Implementation:
  private earthOrbit: U235AstroEllipticalOrbit;

  constructor() {
    const elements = U235AstroEllipticalOrbit.getStandishOrbitalElements().from_1800ad_to_2050ad;
    this.earthOrbit = new U235AstroEllipticalOrbit(elements.earth);

    const message = 'Please call init() before subscribing to outputs';
    this.clockTick$ = throwError(new Error(message));
  }

  init() {
    if (this.date$ === undefined) {
      const msg = 'Requires date$';
      this.clockTick$ = throwError(new Error(msg));
    }
    else {
      this.clockTick$ = this.date$.pipe(
        map(date => {
          const dayFraction = U235AstroClock.calculateDayFraction(date);
          const jd0 = U235AstroClock.calculateJD0FromDate(date);
          const jd = U235AstroClock.calculateJD(dayFraction, jd0);
          const gmst0 = U235AstroClock.calculateGMST0(jd0);
          const gmst = U235AstroClock.calculateGMST(dayFraction, gmst0);
          const obliquityOfEcliptic = U235AstroClock.calculateObliquityOfEcliptic(jd);
          const precessionSinceJ2000 = U235AstroClock.calculatePrecessionSinceJ2000(jd);
          const matEquToEcl = new U235AstroMatrix3D();
          matEquToEcl.setRotateX(obliquityOfEcliptic / 180 * Math.PI);
          const matEclToEqu = new U235AstroMatrix3D();
          matEclToEqu.setRotateX(-obliquityOfEcliptic / 180 * Math.PI);
          const matPrecessToDate = new U235AstroMatrix3D();
          matPrecessToDate.setRotateZ(-precessionSinceJ2000 / 180 * Math.PI);
          const matPrecessFromDate = new U235AstroMatrix3D();
          matPrecessFromDate.setRotateZ(precessionSinceJ2000 / 180 * Math.PI);
          this.earthOrbit.setJulianDate(jd);
          const earthHelEcl2000 = this.earthOrbit.getEclipticPosition();
          return {
            date,
            dayFraction,
            jd0,
            jd,
            gmst0,
            gmst,
            obliquityOfEcliptic,
            precessionSinceJ2000,
            matEquToEcl,
            matEclToEqu,
            matPrecessToDate,
            matPrecessFromDate,
            earthHelEcl2000
          };
        }),
        publishReplay(1),
        refCount()
      );
    }
  }

  static calculateDayFraction(date: Date): number {
    return ((date.getUTCHours() + (date.getUTCMinutes() +
      (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000.0) / 60.0) / 60.0) / 24.0);
  }
  
  static calculateJD0FromDate(date: Date): number {
    let yp = date.getUTCFullYear();
    let mp = date.getUTCMonth() + 1;
    if (mp <= 2) {
      mp += 12;
      yp -= 1;
    }
    let jd0 = Math.trunc(36525 * yp / 100);
    jd0 += Math.trunc((306001 * (1 + mp)) / 10000);
    jd0 += date.getUTCDate() + 2 + Math.trunc(yp / 400);
    jd0 -= Math.trunc(yp / 100);
    jd0 += 1720994.5;
    return jd0;
  }
  
  static calculateJD(dayFrac: number, jd0: number): number {
    return jd0 + dayFrac;
  }

  static calculateDate(jd: number): Date {
    const JGREG = 15 + 31 * (10 + 12 * 1582);
    const julian = jd;
    const p = julian - Math.floor(julian);
    let ja = Math.trunc(Math.floor(julian));
    if (ja >= JGREG) {
      const jalpha = Math.trunc(((ja - 1867216) - 0.25) / 36524.25);
      ja += 1 + jalpha - Math.trunc(jalpha / 4);
    }
    const jb = ja + 1524;
    const jc = Math.trunc(6680.0 + ((jb - 2439870) - 122.1) / 365.25);
    const jdd = 365 * jc + Math.trunc(jc / 4);
    const je = Math.trunc((jb - jdd) / 30.6001);
    const day = jb - jdd - Math.trunc(30.6001 * je);
    let month = je - 1;
    if (month > 12) {
      month -= 12;
    }
    let year = jc - 4715;
    if (month > 2) {
      year -= 1;
    }
    if (year <= 0) {
      year -= 1;
    }
    return new Date(
      Date.UTC(year, month - 1, day) +
      Math.trunc((p + 0.5) * 24 * 60 * 60 * 1000 + 0.5)
    );
  }

  static calculateGMST0(jd0: number): number {
    const tu = (jd0 - 2451545.0) / 36525.0;
    let T = (24110.54841 + tu * (8640184.812866 + tu * (0.093104 - tu * 6.2e-6))) / 3600.0;
    T = T % 24;
    if (T < 0) {
      T += 24;
    }
    return T;
  }
  
  static calculateGMST(dayFrac: number, gmst0: number): number {
    const T = gmst0 + dayFrac * 24 * 1.00273790934;
    return T % 24;
  }
  
  static calculateObliquityOfEcliptic(jd: number): number {
    return 23.4393 - 3.563E-7 * (jd - 2451543.5);
  }
  
  static calculatePrecessionSinceJ2000(jd: number): number {
    return 3.82394E-5 * (jd - 2451543.5);
  }

}
