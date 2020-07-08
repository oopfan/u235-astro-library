import { Observable, throwError, combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { U235AstroClockTick, U235AstroEquatorialCoordinates, U235AstroHorizontalCoordinates, U235AstroEclipticCoordinates } from './u235-astro.interfaces';
import { U235AstroObservatory } from './u235-astro-observatory.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';

export class U235AstroTarget {
    // Inputs:
    geoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    name$: Observable<string>;
    clockTick$: Observable<U235AstroClockTick>;
    matEquToHor$: Observable<U235AstroMatrix3D>;
    matHorToEqu$: Observable<U235AstroMatrix3D>;
    lmst$: Observable<number>;

    // Outputs (equatorial):
    geoEquNow$: Observable<U235AstroEquatorialCoordinates>;
    topoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    topoEquNow$: Observable<U235AstroEquatorialCoordinates>;

    // Outputs (ecliptic):
    geoEcl2000$: Observable<U235AstroEclipticCoordinates>;
    geoEclNow$:  Observable<U235AstroEclipticCoordinates>;
    topoEcl2000$: Observable<U235AstroEclipticCoordinates>;
    topoEclNow$:  Observable<U235AstroEclipticCoordinates>;

    // Outputs (horizontal):
    geoHor2000$: Observable<U235AstroHorizontalCoordinates>;
    geoHorNow$: Observable<U235AstroHorizontalCoordinates>;
    topoHor2000$: Observable<U235AstroHorizontalCoordinates>;
    topoHorNow$: Observable<U235AstroHorizontalCoordinates>;

    // Output (misc):
    hourAngle$: Observable<number>;

    // Implementation:
    private geoEqu2000Vec$: Observable<U235AstroVector3D>;
    private geoEquNowVec$: Observable<U235AstroVector3D>;
    private topoEqu2000Vec$: Observable<U235AstroVector3D>;
    private topoEquNowVec$: Observable<U235AstroVector3D>;
    private geoEcl2000Vec$: Observable<U235AstroVector3D>;
    private geoEclNowVec$: Observable<U235AstroVector3D>;
    private topoEcl2000Vec$: Observable<U235AstroVector3D>;
    private topoEclNowVec$: Observable<U235AstroVector3D>;
    private geoHor2000Vec$: Observable<U235AstroVector3D>;
    private geoHorNowVec$: Observable<U235AstroVector3D>;
    private topoHor2000Vec$: Observable<U235AstroVector3D>;
    private topoHorNowVec$: Observable<U235AstroVector3D>;
    private matEquToEcl2000: U235AstroMatrix3D;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.geoEquNow$ = throwError(new Error(message));
        this.topoEqu2000$ = throwError(new Error(message));
        this.topoEquNow$ = throwError(new Error(message));
        this.geoEcl2000$ = throwError(new Error(message));
        this.geoEclNow$ = throwError(new Error(message));
        this.topoEcl2000$ = throwError(new Error(message));
        this.topoEclNow$ = throwError(new Error(message));
        this.geoHor2000$ = throwError(new Error(message));
        this.geoHorNow$ = throwError(new Error(message));
        this.topoHor2000$ = throwError(new Error(message));
        this.topoHorNow$ = throwError(new Error(message));
        this.hourAngle$ = throwError(new Error(message));
        this.matEquToEcl2000 = new U235AstroMatrix3D();
        this.matEquToEcl2000.setRotateX(23.43928 / 180 * Math.PI);
    }

    connect(observatory: U235AstroObservatory): void {
        this.clockTick$ = observatory.clockTick$;
        this.matEquToHor$ = observatory.matEquToHor$;
        this.matHorToEqu$ = observatory.matHorToEqu$;
        this.lmst$ = observatory.lmst$;
    }

    init() {
        if (this.geoEqu2000$ === undefined) {
            this.geoEqu2000Vec$ = throwError(new Error('Requires geoEqu2000$'));
        }
        else {
            this.geoEqu2000Vec$ = this.geoEqu2000$.pipe(
                map(value => {
                    const vec = new U235AstroVector3D();
                    vec.setPolar(
                        value.rightAscension / 12 * Math.PI,
                        value.declination / 180 * Math.PI,
                        value.distance === undefined ? 1000 : value.distance
                    );
                    return vec;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.geoEcl2000Vec$ = throwError(new Error('Requires clockTick$'));
        }
        else {
            this.geoEcl2000Vec$ = this.geoEqu2000Vec$
            .pipe(
                map(vecIn => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(this.matEquToEcl2000);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.matEquToHor$ === undefined) {
            this.geoHor2000Vec$ = throwError(new Error('Requires matEquToHor$'));
        }
        else {
            this.geoHor2000Vec$ = combineLatest(
                this.geoEqu2000Vec$,
                this.matEquToHor$
            ).pipe(
                map(([vecIn, mat]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(mat);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        this.topoHor2000Vec$ = this.geoHor2000Vec$.pipe(map(vecIn => {
            const vecOut = new U235AstroVector3D();
            vecOut.assign(vecIn);
            vecOut.setElement(3, vecOut.getElement(3) - 6378.137 / 149597870.691);  // Horizontal Parallax
            return vecOut;
        }));

        if (this.matHorToEqu$ === undefined) {
            this.topoEqu2000Vec$ = throwError(new Error('Requires matHorToEqu$'));
        }
        else {
            this.topoEqu2000Vec$ = combineLatest(
                this.topoHor2000Vec$,
                this.matHorToEqu$
            ).pipe(
                map(([vecIn, mat]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(mat);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.geoEclNowVec$ = throwError(new Error('Requires clockTick$'));
        }
        else {
            this.geoEclNowVec$ = combineLatest(
                this.geoEcl2000Vec$,
                this.clockTick$
            ).pipe(
                map(([vecIn, clockTick]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(clockTick.matPrecessToDate);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.geoEquNowVec$ = throwError(new Error('Requires clockTick$'));
        }
        else {
            this.geoEquNowVec$ = combineLatest(
                this.geoEclNowVec$,
                this.clockTick$
            ).pipe(
                map(([vecIn, clockTick]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(clockTick.matEclToEqu);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.matEquToHor$ === undefined) {
            this.geoHorNowVec$ = throwError(new Error('Requires matEquToHor$'));
        }
        else {
            this.geoHorNowVec$ = combineLatest(
                this.geoEquNowVec$,
                this.matEquToHor$
            ).pipe(
                map(([vecIn, mat]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(mat);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        this.topoHorNowVec$ = this.geoHorNowVec$.pipe(map(vecIn => {
            const vecOut = new U235AstroVector3D();
            vecOut.assign(vecIn);
            vecOut.setElement(3, vecOut.getElement(3) - 6378.137 / 149597870.691);  // Horizontal Parallax
            return vecOut;
        }));

        if (this.matHorToEqu$ === undefined) {
            this.topoEquNowVec$ = throwError(new Error('Requires matHorToEqu$'));
        }
        else {
            this.topoEquNowVec$ = combineLatest(
                this.topoHorNowVec$,
                this.matHorToEqu$
            ).pipe(
                map(([vecIn, mat]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(mat);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.topoEcl2000Vec$ = throwError(new Error('Requires clockTick$'));
        }
        else {
            this.topoEcl2000Vec$ = this.topoEqu2000Vec$
            .pipe(
                map(vecIn => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(this.matEquToEcl2000);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.topoEclNowVec$ = throwError(new Error('Requires clockTick$'));
        }
        else {
            this.topoEclNowVec$ = combineLatest(
                this.topoEquNowVec$,
                this.clockTick$
            ).pipe(
                map(([vecIn, clockTick]) => {
                    const vecOut = new U235AstroVector3D();
                    vecOut.assign(vecIn);
                    vecOut.matrixMultiply(clockTick.matEquToEcl);
                    return vecOut;
                }),
                publishReplay(1),
                refCount()
            );
        }

        this.geoEquNow$ = this.geoEquNowVec$.pipe(map(U235AstroTarget.VectorToEquatorialCoordinates));
        this.topoEqu2000$ = this.topoEqu2000Vec$.pipe(map(U235AstroTarget.VectorToEquatorialCoordinates));
        this.topoEquNow$ = this.topoEquNowVec$.pipe(map(U235AstroTarget.VectorToEquatorialCoordinates));
        this.geoEcl2000$ = this.geoEcl2000Vec$.pipe(map(U235AstroTarget.VectorToEclipticCoordinates));
        this.geoEclNow$ = this.geoEclNowVec$.pipe(map(U235AstroTarget.VectorToEclipticCoordinates));
        this.topoEcl2000$ = this.topoEcl2000Vec$.pipe(map(U235AstroTarget.VectorToEclipticCoordinates));
        this.topoEclNow$ = this.topoEclNowVec$.pipe(map(U235AstroTarget.VectorToEclipticCoordinates));
        this.geoHor2000$ = this.geoHor2000Vec$.pipe(map(U235AstroTarget.VectorToHorizontalCoordinates));
        this.geoHorNow$ = this.geoHorNowVec$.pipe(map(U235AstroTarget.VectorToHorizontalCoordinates));
        this.topoHor2000$ = this.topoHor2000Vec$.pipe(map(U235AstroTarget.VectorToHorizontalCoordinates));
        this.topoHorNow$ = this.topoHorNowVec$.pipe(map(U235AstroTarget.VectorToHorizontalCoordinates));
    
        if (this.lmst$ === undefined) {
            this.hourAngle$ = throwError(new Error('Requires lmst$'));
        }
        else {
            this.hourAngle$ = combineLatest(
                this.topoEquNow$,
                this.lmst$
            ).pipe(
                map(([topoEquNow, lmst]) => {
                    let ha = lmst - topoEquNow.rightAscension;
                    if (ha > 12) {
                        ha -= 24;
                    }
                    if (ha < -12) {
                        ha += 24;
                    }
                    return ha;
                }),
                publishReplay(1),
                refCount()
            );
        }

    }

    private static VectorToEquatorialCoordinates(vec: U235AstroVector3D): U235AstroEquatorialCoordinates {
        const result = vec.getPolar();
        let rightAscension = result[0] / Math.PI * 12;
        if (rightAscension < 0) {
            rightAscension += 24;
        }
        return {
            rightAscension,
            declination: result[1] / Math.PI * 180,
            distance: result[2]
        }
    }

    private static VectorToEclipticCoordinates(vec: U235AstroVector3D): U235AstroEclipticCoordinates {
        const result = vec.getPolar();
        let longitude = result[0] / Math.PI * 180;
        if (longitude < 0) {
            longitude += 360;
        }
        return {
            longitude,
            latitude: result[1] / Math.PI * 180,
            distance: result[2]
        }
    }

    private static VectorToHorizontalCoordinates(vec: U235AstroVector3D): U235AstroHorizontalCoordinates {
        const result = vec.getPolar();
        return {
            azimuth: (1 - result[0] / Math.PI) * 180,
            altitude: result[1] / Math.PI * 180,
            distance: result[2]
        }
    }

}
