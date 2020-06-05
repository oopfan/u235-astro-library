import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { U235AstroClockTick } from './u235-astro.interfaces';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroClock {
  // Inputs:
  date$: Observable<Date>;

  // Outputs:
  clockTick$: Observable<U235AstroClockTick>;

  constructor() {
    const message = 'Please call init() before accessing calculated Observables';
    this.clockTick$ = throwError(new Error(message));
  }

  init() {
    if (this.date$ === undefined) {
      const msg = 'Requires date$';
      this.clockTick$ = throwError(new Error(msg));
    }
    else {
      this.clockTick$ = this.date$.pipe(map(calculateClockTick));
    }
  }

}

function calculateClockTick(date: Date): U235AstroClockTick {
  // console.log('calc clockTick');
  const dayFraction = calculateDayFraction(date);
  const jd0 = calculateJD0FromDate(date);
  const jd = calculateJD(dayFraction, jd0);
  const gmst0 = calculateGMST0(jd0);
  const gmst = calculateGMST(dayFraction, gmst0);
  const obliquityOfEcliptic = calculateObliquityOfEcliptic(jd);
  const precessionSinceJ2000 = calculatePrecessionSinceJ2000(jd);
  const matEquToEcl = new U235AstroMatrix3D();
  matEquToEcl.setRotateX(obliquityOfEcliptic / 180 * Math.PI);
  const matEclToEqu = new U235AstroMatrix3D();
  matEclToEqu.setRotateX(-obliquityOfEcliptic / 180 * Math.PI);
  const matPrecessToDate = new U235AstroMatrix3D();
  matPrecessToDate.setRotateZ(-precessionSinceJ2000 / 180 * Math.PI);
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
    matPrecessToDate
  };
}

function calculateDayFraction(date: Date): number {
  // console.log('calc dayFraction');
  return ((date.getUTCHours() + (date.getUTCMinutes() +
    (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000.0) / 60.0) / 60.0) / 24.0);
}

function calculateJD0FromDate(date: Date): number {
  // console.log('calc JD0');
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

function calculateJD(dayFrac: number, jd0: number): number {
  // console.log('calc JD');
  return jd0 + dayFrac;
}

function calculateGMST0(jd0: number): number {
  // console.log('calc GMST0');
  const tu = (jd0 - 2451545.0) / 36525.0;
  let T = (24110.54841 + tu * (8640184.812866 + tu * (0.093104 - tu * 6.2e-6))) / 3600.0;
  T = T % 24;
  if (T < 0) {
    T += 24;
  }
  return T;
}

function calculateGMST(dayFrac: number, gmst0: number): number {
  // console.log('calc GMST');
  const T = gmst0 + dayFrac * 24 * 1.00273790934;
  return T % 24;
}

function calculateObliquityOfEcliptic(jd: number): number {
  return 23.4393 - 3.563E-7 * (jd - 2451543.5);
}

function calculatePrecessionSinceJ2000(jd: number): number {
  return 3.82394E-5 * (jd - 2451543.5);
}
