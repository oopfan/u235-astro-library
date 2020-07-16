import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';
import { U235AstroVector3D } from './u235-astro-vector3d.class';

export interface U235AstroMoonPhaseStats {
    date: Date;     // The exact time that the Moon's phase was updated.
    phaseName: string;  // The name of the phase, for example 'Full Moon'.
    phasePct: number;   // The difference in geocentric ecliptic longitude
                        // between the Moon and Sun:
                        //   0: New Moon,
                        //   0.5: First Quarter,
                        //  -0.5: Last Quarter,
                        //   1.0 or -1.0: Full Moon
                        // and all numbers between.
    illuminationPct: number;    // The percentage of the Moon's disc that
                                // is illuminated. A number from 0 to 1.
                                // This is not necessarily the same as the
                                // absolute value of 'phasePct'. Instead, it
                                // is proportional to the angular separation
                                // between the Moon and Sun.
}

export interface U235AstroFlashArg {
    backgroundColor?: string;
    transitionDuration?: string;
}

export interface U235AstroClockTick {
    date: Date;
    dayFraction: number;
    jd0: number;
    jd: number;
    gmst0: number;
    gmst: number;
    obliquityOfEcliptic: number;
    precessionSinceJ2000: number;
    matEquToEcl: U235AstroMatrix3D;
    matEclToEqu: U235AstroMatrix3D;
    matPrecessToDate: U235AstroMatrix3D;
    matPrecessFromDate: U235AstroMatrix3D;
}

export interface U235AstroEquatorialCoordinates {
    rightAscension: number;
    declination: number;
    distance?: number;
}

export interface U235AstroEclipticCoordinates {
    latitude: number;
    longitude: number;
    distance: number;
}

export interface U235AstroHorizontalCoordinates {
    azimuth: number;
    altitude: number;
    distance: number;
}

export interface U235AstroRootHelper {
    solveY(x: number): number;
}

export interface U235AstroRootSolution {
    xRoot: number,
    yRoot: number,
    iterations: number
}

export interface U235AstroEllipticalOrbitalElements {
    semiMajorAxis: [number, number];
    eccentricity: [number, number];
    inclination: [number, number];
    meanLongitude: [number, number];
    argumentOfPerihelion: [number, number];
    longitudeOfAscendingNode: [number, number];
    extra?: [number, number, number, number];
}

export interface U235AstroPlanetaryOrbitalElements {
    mercury: U235AstroEllipticalOrbitalElements;
    venus: U235AstroEllipticalOrbitalElements;
    earth: U235AstroEllipticalOrbitalElements;
    mars: U235AstroEllipticalOrbitalElements;
    jupiter: U235AstroEllipticalOrbitalElements;
    saturn: U235AstroEllipticalOrbitalElements;
    uranus: U235AstroEllipticalOrbitalElements;
    neptune: U235AstroEllipticalOrbitalElements;
    pluto: U235AstroEllipticalOrbitalElements;
}

export interface U235AstroStandishOrbitalElements {
    from_3000bc_to_3000ad: U235AstroPlanetaryOrbitalElements,
    from_1800ad_to_2050ad: U235AstroPlanetaryOrbitalElements
}

export interface U235AstroOrbitalPosition {
    meanAnomaly: number;
    eccentricAnomaly: number;
    trueAnomaly: number;
    coordinates: U235AstroVector3D;
}
