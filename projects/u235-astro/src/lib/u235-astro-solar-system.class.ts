import { Observable, throwError } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { U235AstroEllipticalOrbit } from './u235-astro-elliptical-orbit.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';
import { U235AstroClockTick, U235AstroEquatorialCoordinates } from './u235-astro.interfaces';
import { U235AstroClock } from './u235-astro-clock.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroReactiveSolarSystem {

    // Inputs:
    clockTick$: Observable<U235AstroClockTick>;

    // Outputs:
    sunEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    mercuryEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    venusEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    marsEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    jupiterEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    saturnEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    uranusEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    neptuneEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    plutoEqu2000$: Observable<U235AstroEquatorialCoordinates>;

    // Implementation:
    private mercuryOrbit: U235AstroEllipticalOrbit;
    private venusOrbit: U235AstroEllipticalOrbit;
    private marsOrbit: U235AstroEllipticalOrbit;
    private jupiterOrbit: U235AstroEllipticalOrbit;
    private saturnOrbit: U235AstroEllipticalOrbit;
    private uranusOrbit: U235AstroEllipticalOrbit;
    private neptuneOrbit: U235AstroEllipticalOrbit;
    private plutoOrbit: U235AstroEllipticalOrbit;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.sunEqu2000$ = throwError(new Error(message));
        this.mercuryEqu2000$ = throwError(new Error(message));
        this.venusEqu2000$ = throwError(new Error(message));
        this.marsEqu2000$ = throwError(new Error(message));
        this.jupiterEqu2000$ = throwError(new Error(message));
        this.saturnEqu2000$ = throwError(new Error(message));
        this.uranusEqu2000$ = throwError(new Error(message));
        this.neptuneEqu2000$ = throwError(new Error(message));
        this.plutoEqu2000$ = throwError(new Error(message));
    
        const elements = U235AstroEllipticalOrbit.getStandishOrbitalElements().from_1800ad_to_2050ad;
        this.mercuryOrbit = new U235AstroEllipticalOrbit(elements.mercury);
        this.venusOrbit = new U235AstroEllipticalOrbit(elements.venus);
        this.marsOrbit = new U235AstroEllipticalOrbit(elements.mars);
        this.jupiterOrbit = new U235AstroEllipticalOrbit(elements.jupiter);
        this.saturnOrbit = new U235AstroEllipticalOrbit(elements.saturn);
        this.uranusOrbit = new U235AstroEllipticalOrbit(elements.uranus);
        this.neptuneOrbit = new U235AstroEllipticalOrbit(elements.neptune);
        this.plutoOrbit = new U235AstroEllipticalOrbit(elements.pluto);
    }

    connect(clock: U235AstroClock): void {
        this.clockTick$ = clock.clockTick$;
    }
    
    init() {
        const msg = 'Requires clockTick$';

        if (this.clockTick$ === undefined) {
            this.mercuryEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.mercuryEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.mercuryOrbit.setJulianDate(clockTick.jd);
                    const mercuryHelEcl2000 = this.mercuryOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(mercuryHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.venusEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.venusEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.venusOrbit.setJulianDate(clockTick.jd);
                    const venusHelEcl2000 = this.venusOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(venusHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.sunEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.sunEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    const sunHelEcl2000 = new U235AstroVector3D();
                    sunHelEcl2000.setElement(1, 0);
                    sunHelEcl2000.setElement(2, 0);
                    sunHelEcl2000.setElement(3, 0);
                    return U235AstroReactiveSolarSystem.transformCoordinates(sunHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.marsEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.marsEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.marsOrbit.setJulianDate(clockTick.jd);
                    const marsHelEcl2000 = this.marsOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(marsHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.jupiterEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.jupiterEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.jupiterOrbit.setJulianDate(clockTick.jd);
                    const jupiterHelEcl2000 = this.jupiterOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(jupiterHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.saturnEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.saturnEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.saturnOrbit.setJulianDate(clockTick.jd);
                    const saturnHelEcl2000 = this.saturnOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(saturnHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.uranusEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.uranusEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.uranusOrbit.setJulianDate(clockTick.jd);
                    const uranusHelEcl2000 = this.uranusOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(uranusHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.neptuneEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.neptuneEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.neptuneOrbit.setJulianDate(clockTick.jd);
                    const neptuneHelEcl2000 = this.neptuneOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(neptuneHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.plutoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.plutoEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.plutoOrbit.setJulianDate(clockTick.jd);
                    const plutoHelEcl2000 = this.plutoOrbit.getEclipticPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(plutoHelEcl2000, clockTick.earthHelEcl2000, clockTick.matEclToEqu);
                }),
                publishReplay(1),
                refCount()
            );
        }

    }
    
    static transformCoordinates(
        planetHelEcl2000: U235AstroVector3D,
        earthHelEcl2000: U235AstroVector3D,
        matEclToEqu: U235AstroMatrix3D
        ): U235AstroEquatorialCoordinates {

        const vec = new U235AstroVector3D();
        vec.setElement(1, planetHelEcl2000.getElement(1));
        vec.setElement(2, planetHelEcl2000.getElement(2));
        vec.setElement(3, planetHelEcl2000.getElement(3));
        vec.subtract(earthHelEcl2000);
        vec.matrixMultiply(matEclToEqu);

        const result = vec.getPolar();
        let phi = result[0];
        if (phi < 0) {
            phi += 2 * Math.PI;
        }
        const theta = result[1];
        const radius = result[2];

        return {
            rightAscension: phi / Math.PI * 12,
            declination: theta / Math.PI * 180,
            distance: radius
        }
    }

}
