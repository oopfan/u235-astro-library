import { Observable, throwError } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { U235AstroClockTick, U235AstroEquatorialCoordinates } from './u235-astro.interfaces';
import { U235AstroClock } from './u235-astro-clock.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroReactiveSchlyterMoon {
    // Inputs:
    clockTick$: Observable<U235AstroClockTick>;

    // Outputs:
    equ2000$: Observable<U235AstroEquatorialCoordinates>;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.equ2000$ = throwError(new Error(message));
    }

    connect(clock: U235AstroClock): void {
        this.clockTick$ = clock.clockTick$;
    }
    
    init() {
        if (this.clockTick$ === undefined) {
            const msg = 'Requires clockTick$';
            this.equ2000$ = throwError(new Error(msg));
        }
        else {
            this.equ2000$ = this.clockTick$.pipe(
                map(clockTick => {
                    const geoEclOfDate = U235AstroReactiveSchlyterMoon.calculateGeoEclOfDate(clockTick.jd);
                    const geoEcl2000 = U235AstroReactiveSchlyterMoon.calculateGeoEcl2000(geoEclOfDate, clockTick.matPrecessFromDate);
                    const geoEqu2000 = U235AstroReactiveSchlyterMoon.calculateGeoEqu2000(geoEcl2000, clockTick.matEclToEqu);

                    const result = geoEqu2000.getPolar();
                    let phi = result[0];
                    if (phi < 0) {
                        phi += 2 * Math.PI;
                    }
                    const theta = result[1];
            
                    return {
                        rightAscension: phi / Math.PI * 12,
                        declination: theta / Math.PI * 180
                    }
                }),
                publishReplay(1),
                refCount()
            );
        }
    }

    private static calculateGeoEqu2000(geoEcl2000: U235AstroVector3D, matEclToEqu: U235AstroMatrix3D): U235AstroVector3D {
        const geoEqu2000 = new U235AstroVector3D();
        geoEqu2000.setElement(1, geoEcl2000.getElement(1));
        geoEqu2000.setElement(2, geoEcl2000.getElement(2));
        geoEqu2000.setElement(3, geoEcl2000.getElement(3));
        geoEqu2000.matrixMultiply(matEclToEqu);
        return geoEqu2000;
    }


    private static calculateGeoEcl2000(geoEclOfDate: U235AstroVector3D, matPrecession: U235AstroMatrix3D): U235AstroVector3D {
        const geoEcl2000 = new U235AstroVector3D();
        geoEcl2000.setElement(1, geoEclOfDate.getElement(1));
        geoEcl2000.setElement(2, geoEclOfDate.getElement(2));
        geoEcl2000.setElement(3, geoEclOfDate.getElement(3));
        geoEcl2000.matrixMultiply(matPrecession);
        return geoEcl2000;
    }

    static calculateGeoEclOfDate(julianDate: number): U235AstroVector3D {
        var KilometersPerAU = 149597870.691;
        var EquatorialRadiusOfEarthInKilometers = 6378.137;

        var d = julianDate - 2451543.5;   // Day 0.0 occurs at 2000 Jan 0.0 UT

        let Ms: number;     // Mean Anomaly of the Sun in radians
        let Mm: number;     // Mean Anomaly of the Moon in radians
        let Nm: number;     // Longitude of the Moon's node in radians
        let ws: number;     // Argument of perihelion for the Sun in radians
        let wm: number;     // Argument of perihelion for the Moon in radians
        let im: number;     // Inclination of the orbit of the Moon in radians
        let em: number;     // Eccentricity of the Moon
        let am: number;     // Semi-major axis of the Moon (Earth radii)
        let Ls: number;     // Mean Longitude of the Sun in radians (Ns=0)
        let Lm: number;     // Mean longitude of the Moon in radians
        let D: number;      // Mean elongation of the Moon in radians
        let F: number;      // Argument of latitude for the Moon in radians
        let Em: number;     // Eccentric Anomaly of the Moon in radians
        let Em0: number;    // Eccentric Anomaly of the Moon in radians initial
        let Em1: number;    // Eccentric Anomaly of the Moon in radians next interation
        let xvm: number;    // x-coordinate of the Moon in its orbital plane in Earth radii
        let yvm: number;    // y-coordinate of the Moon in its orbital plane in Earth radii
        let vm: number;     // True anomaly of the Moon in radians
        let rm: number;     // Distance to the Moon in Earth radii
        let xhm: number;    // x-coordinate of the Moon in the Ecliptic plane in Earth radii
        let yhm: number;    // y-coordinate of the Moon in the Ecliptic plane in Earth radii
        let zhm: number;    // z-coordinate of the Moon in the Ecliptic plane in Earth radii
        let lonecl: number; // Ecliptic longitude of the Moon in degrees
        let latecl: number; // Ecliptic latitude of the Moon in degrees

        Ms = (356.0470 + 0.9856002585 * d) * Math.PI / 180;
        Mm = (115.3654 + 13.0649929509 * d) * Math.PI / 180;
        Nm = (125.1228 - 0.0529538083 * d) * Math.PI / 180;
        ws = (282.9404 + 4.70935E-5 * d) * Math.PI / 180;
        wm = (318.0634 + 0.1643573223 * d) * Math.PI / 180;
        im = 5.1454 * Math.PI / 180;
        am = 60.2666;
        em = 0.0549;

        Ls = Ms + ws;
        Lm = Mm + wm + Nm;
        D = Lm - Ls;
        F = Lm - Nm;

        Em1 = Mm + em * Math.sin(Mm) * (1 + em * Math.cos(Mm));
        do {
            Em0 = Em1;
            Em1 = Em0 - (Em0 - em * Math.sin(Em0) - Mm) / (1 - em * Math.cos(Em0));
        } while ((Math.abs(Em1 - Em0) * 180 / Math.PI) > 0.001);
        Em = Em1;

        xvm = am * (Math.cos(Em) - em);
        yvm = am * (Math.sqrt(1 - em * em) * Math.sin(Em));
        vm = Math.atan2(yvm, xvm);
        rm = Math.sqrt(xvm * xvm + yvm * yvm);

        xhm = rm * (Math.cos(Nm) * Math.cos(vm + wm) -
            Math.sin(Nm) * Math.sin(vm + wm) * Math.cos(im));

        yhm = rm * (Math.sin(Nm) * Math.cos(vm + wm) +
            Math.cos(Nm) * Math.sin(vm + wm) * Math.cos(im));

        zhm = rm * (Math.sin(vm + wm) * Math.sin(im));

        lonecl = Math.atan2(yhm, xhm) * 180 / Math.PI;
        latecl = Math.atan2(zhm, Math.sqrt(xhm * xhm + yhm * yhm)) * 180 / Math.PI;

        // Add perturbations to longitude
        lonecl += -1.274 * Math.sin(Mm - 2 * D);        // (the Evection)
        lonecl += 0.658 * Math.sin(2 * D);              // (the Variation)
        lonecl += -0.186 * Math.sin(Ms);                // (the Yearly Equation)
        lonecl += -0.059 * Math.sin(2 * Mm - 2 * D);
        lonecl += -0.057 * Math.sin(Mm - 2 * D + Ms);
        lonecl += 0.053 * Math.sin(Mm + 2 * D);
        lonecl += 0.046 * Math.sin(2 * D - Ms);
        lonecl += 0.041 * Math.sin(Mm - Ms);
        lonecl += -0.035 * Math.sin(D);                 // (the Parallactic Equation)
        lonecl += -0.031 * Math.sin(Mm + Ms);
        lonecl += -0.015 * Math.sin(2 * F - 2 * D);
        lonecl += 0.011 * Math.sin(Mm - 4 * D);
        lonecl = lonecl * Math.PI / 180;

        // Add perturbations to latitude
        latecl += -0.173 * Math.sin(F - 2 * D);
        latecl += -0.055 * Math.sin(Mm - F - 2 * D);
        latecl += -0.046 * Math.sin(Mm + F - 2 * D);
        latecl += 0.033 * Math.sin(F + 2 * D);
        latecl += 0.017 * Math.sin(2 * Mm + F);
        latecl = latecl * Math.PI / 180;

        // Add perturbations to distance
        rm += -0.58 * Math.cos(Mm - 2 * D);
        rm += -0.46 * Math.cos(2 * D);

        const sinpar = 1 / rm;
        const cossin = Math.cos(latecl) / sinpar;
        const f = EquatorialRadiusOfEarthInKilometers / KilometersPerAU;

        const x = Math.cos(lonecl) * cossin * f;
        const y = Math.sin(lonecl) * cossin * f;
        const z = Math.sin(latecl) / sinpar * f;

        const geoEclOfDate = new U235AstroVector3D();
        geoEclOfDate.setElement(1, x);
        geoEclOfDate.setElement(2, y);
        geoEclOfDate.setElement(3, z);

        return geoEclOfDate;
    }




}
