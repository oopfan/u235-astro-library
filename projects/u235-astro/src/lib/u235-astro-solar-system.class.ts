import { Observable, throwError, combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { U235AstroEllipticalOrbit } from './u235-astro-elliptical-orbit.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';
import { U235AstroClockTick, U235AstroEquatorialCoordinates } from './u235-astro.interfaces';
import { U235AstroClock } from './u235-astro-clock.class';

export class U235AstroReactiveSolarSystem {

    // Inputs:
    clockTick$: Observable<U235AstroClockTick>;

    // Outputs:
    sunGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    mercuryGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    venusGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    marsGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    jupiterGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    saturnGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    uranusGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    neptuneGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    plutoGeoEqu2000$: Observable<U235AstroEquatorialCoordinates>;

    // Implementation:
    private mercuryOrbit: U235AstroEllipticalOrbit;
    private venusOrbit: U235AstroEllipticalOrbit;
    private earthOrbit: U235AstroEllipticalOrbit;
    private marsOrbit: U235AstroEllipticalOrbit;
    private jupiterOrbit: U235AstroEllipticalOrbit;
    private saturnOrbit: U235AstroEllipticalOrbit;
    private uranusOrbit: U235AstroEllipticalOrbit;
    private neptuneOrbit: U235AstroEllipticalOrbit;
    private plutoOrbit: U235AstroEllipticalOrbit;
    private earthHelEqu2000$: Observable<U235AstroVector3D>;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.sunGeoEqu2000$ = throwError(new Error(message));
        this.mercuryGeoEqu2000$ = throwError(new Error(message));
        this.venusGeoEqu2000$ = throwError(new Error(message));
        this.marsGeoEqu2000$ = throwError(new Error(message));
        this.jupiterGeoEqu2000$ = throwError(new Error(message));
        this.saturnGeoEqu2000$ = throwError(new Error(message));
        this.uranusGeoEqu2000$ = throwError(new Error(message));
        this.neptuneGeoEqu2000$ = throwError(new Error(message));
        this.plutoGeoEqu2000$ = throwError(new Error(message));
    
        const elements = U235AstroEllipticalOrbit.getStandishOrbitalElements().from_1800ad_to_2050ad;
        this.mercuryOrbit = new U235AstroEllipticalOrbit(elements.mercury);
        this.venusOrbit = new U235AstroEllipticalOrbit(elements.venus);
        this.earthOrbit = new U235AstroEllipticalOrbit(elements.earth);
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
            this.earthHelEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.earthHelEqu2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    this.earthOrbit.setJulianDate(clockTick.jd);
                    return this.earthOrbit.getEquatorialPosition();
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.mercuryGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.mercuryGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.mercuryOrbit.setJulianDate(clockTick.jd);
                    const mercuryHelEqu2000 = this.mercuryOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(mercuryHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.venusGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.venusGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.venusOrbit.setJulianDate(clockTick.jd);
                    const venusHelEqu2000 = this.venusOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(venusHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.sunGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.sunGeoEqu2000$ = this.earthHelEqu2000$
            .pipe(
                map(earthHelEqu2000 => {
                    const sunHelEqu2000 = new U235AstroVector3D();
                    sunHelEqu2000.setElement(1, 0);
                    sunHelEqu2000.setElement(2, 0);
                    sunHelEqu2000.setElement(3, 0);
                    return U235AstroReactiveSolarSystem.transformCoordinates(sunHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.marsGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.marsGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.marsOrbit.setJulianDate(clockTick.jd);
                    const marsHelEqu2000 = this.marsOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(marsHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.jupiterGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.jupiterGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.jupiterOrbit.setJulianDate(clockTick.jd);
                    const jupiterHelEqu2000 = this.jupiterOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(jupiterHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.saturnGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.saturnGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.saturnOrbit.setJulianDate(clockTick.jd);
                    const saturnHelEqu2000 = this.saturnOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(saturnHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.uranusGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.uranusGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.uranusOrbit.setJulianDate(clockTick.jd);
                    const uranusHelEqu2000 = this.uranusOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(uranusHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.neptuneGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.neptuneGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.neptuneOrbit.setJulianDate(clockTick.jd);
                    const neptuneHelEqu2000 = this.neptuneOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(neptuneHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

        if (this.clockTick$ === undefined) {
            this.plutoGeoEqu2000$ = throwError(new Error(msg));
        }
        else {
            this.plutoGeoEqu2000$ = combineLatest(
                this.clockTick$,
                this.earthHelEqu2000$
            ).pipe(
                map(([clockTick, earthHelEqu2000]) => {
                    this.plutoOrbit.setJulianDate(clockTick.jd);
                    const plutoHelEqu2000 = this.plutoOrbit.getEquatorialPosition();
                    return U235AstroReactiveSolarSystem.transformCoordinates(plutoHelEqu2000, earthHelEqu2000);
                }),
                publishReplay(1),
                refCount()
            );
        }

    }
    
    private static transformCoordinates(
        planetHelEqu2000: U235AstroVector3D,
        earthHelEqu2000: U235AstroVector3D
        ): U235AstroEquatorialCoordinates {

        const vec = new U235AstroVector3D();
        vec.assign(planetHelEqu2000);
        vec.subtract(earthHelEqu2000);

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
