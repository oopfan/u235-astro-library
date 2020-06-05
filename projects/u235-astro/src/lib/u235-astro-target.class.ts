import { Observable, throwError, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { U235AstroClockTick, U235AstroEquatorialCoordinates, U235AstroHorizontalCoordinates } from './u235-astro.interfaces';
import { U235AstroObservatory } from './u235-astro-observatory.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';

export class U235AstroTarget {
    // Inputs:
    name$: Observable<string>;
    equ2000$: Observable<U235AstroEquatorialCoordinates>;
    clockTick$: Observable<U235AstroClockTick>;
    matEquToHor$: Observable<U235AstroMatrix3D>;
    lmst$: Observable<number>;

    // Outputs:
    equNow$: Observable<U235AstroEquatorialCoordinates>;
    horNow$: Observable<U235AstroHorizontalCoordinates>;
    hourAngle$: Observable<number>;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.equNow$ = throwError(new Error(message));
        this.horNow$ = throwError(new Error(message));
        this.hourAngle$ = throwError(new Error(message));
    }

    connect(observatory: U235AstroObservatory): void {
        this.clockTick$ = observatory.clockTick$;
        this.matEquToHor$ = observatory.matEquToHor$;
        this.lmst$ = observatory.lmst$;
    }

    init() {
        if (this.equ2000$ === undefined || this.clockTick$ === undefined) {
            this.equNow$ = throwError(new Error('Requires equ2000$ and clockTick$'));
        }
        else {
            this.equNow$ = combineLatest(
                this.equ2000$,
                this.clockTick$
            ).pipe(
                map(([equ2000, clockTick]) => {
                    const vec = new U235AstroVector3D();
                    vec.setPolar(
                        equ2000.rightAscension / 12 * Math.PI,
                        equ2000.declination / 180 * Math.PI,
                        1
                    );
                    vec.matrixMultiply(clockTick.matEquToEcl);
                    vec.matrixMultiply(clockTick.matPrecessToDate);
                    vec.matrixMultiply(clockTick.matEclToEqu);
                    const result = vec.getPolar();
                    let raNow = result[0];
                    if (raNow < 0) {
                        raNow += 2 * Math.PI;
                    }
                    const deNow = result[1];
                    return {
                        rightAscension: raNow / Math.PI * 12,
                        declination: deNow / Math.PI * 180
                    }
                })
            );
        }

        if (this.matEquToHor$ === undefined) {
            this.horNow$ = throwError(new Error('Requires matEquToHor$'))
        }
        else {
            this.horNow$ = combineLatest(
                this.equNow$,
                this.matEquToHor$
            ).pipe(
                map(([equNow, matEquToHor]) => {
                    const vec = new U235AstroVector3D();
                    vec.setPolar(
                        equNow.rightAscension / 12 * Math.PI,
                        equNow.declination / 180 * Math.PI,
                        1
                    );
                    vec.matrixMultiply(matEquToHor);
                    const result = vec.getPolar();
                    const az = Math.PI - result[0];
                    const alt = result[1];
                    return {
                        azimuth: az / Math.PI * 180,
                        altitude: alt / Math.PI * 180
                    }
                })
            );
        }

        if (this.lmst$ === undefined) {
            this.hourAngle$ = throwError(new Error('Requires lmst$'));
        }
        else {
            this.hourAngle$ = combineLatest(
                this.equNow$,
                this.lmst$
            ).pipe(
                map(([equNow, lmst]) => {
                    let ha = lmst - equNow.rightAscension;
                    if (ha > 12) {
                        ha -= 24;
                    }
                    if (ha < -12) {
                        ha += 24;
                    }
                    return ha;
                })
            );
        }

    }
}
