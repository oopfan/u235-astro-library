import { Observable, throwError, combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { U235AstroClockTick } from './u235-astro.interfaces';
import { U235AstroClock } from './u235-astro-clock.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroObservatory {
  // Inputs:
  name$: Observable<string>;
  latitude$: Observable<number>;
  longitude$: Observable<number>;
  clockTick$: Observable<U235AstroClockTick>;

  // Outputs:
  lmst$: Observable<number>;
  matEquToHor$: Observable<U235AstroMatrix3D>;
  matHorToEqu$: Observable<U235AstroMatrix3D>;

  constructor() {
    const message = 'Please call init() before subscribing to outputs';
    this.lmst$ = throwError(new Error(message));
    this.matEquToHor$ = throwError(new Error(message));
  }

  connect(clock: U235AstroClock): void {
    this.clockTick$ = clock.clockTick$;
  }

  init() {
    if (this.clockTick$ === undefined || this.longitude$ === undefined) {
      this.lmst$ = throwError(new Error('Requires clockTick$ and longitude$'));
    }
    else {
      this.lmst$ = combineLatest(
        this.clockTick$,
        this.longitude$
      ).pipe(
        map(([clockTick, longitude]) => {
          let lmst = clockTick.gmst + longitude / 15;
          if (lmst < 0) {
              lmst += 24;
          }
          if (lmst >= 24) {
              lmst -= 24;
          }
          return lmst;
        }),
        publishReplay(1),
        refCount()
      );
    }

    if (this.latitude$ === undefined) {
      this.matEquToHor$ = throwError(new Error('Requires latitude$'));
    }
    else {
      this.matEquToHor$ = combineLatest(
        this.latitude$,
        this.lmst$
      ).pipe(
        map(([latitude, lmst]) => {
          const rotY = new U235AstroMatrix3D();
          rotY.setRotateY((90 - latitude) / 180 * Math.PI);
          const rotZ = new U235AstroMatrix3D();
          rotZ.setRotateZ(lmst / 12 * Math.PI);
          const mat = new U235AstroMatrix3D();
          mat.matrixMultiply(rotY).matrixMultiply(rotZ);
          return mat;
        }),
        publishReplay(1),
        refCount()
      );
    }

    if (this.latitude$ === undefined) {
      this.matHorToEqu$ = throwError(new Error('Requires latitude$'));
    }
    else {
      this.matHorToEqu$ = combineLatest(
        this.latitude$,
        this.lmst$
      ).pipe(
        map(([latitude, lmst]) => {
          const rotY = new U235AstroMatrix3D();
          rotY.setRotateY((latitude - 90) / 180 * Math.PI);
          const rotZ = new U235AstroMatrix3D();
          rotZ.setRotateZ(-lmst / 12 * Math.PI);
          const mat = new U235AstroMatrix3D();
          mat.matrixMultiply(rotZ).matrixMultiply(rotY);
          return mat;
        }),
        publishReplay(1),
        refCount()
      );
    }

  }

}
