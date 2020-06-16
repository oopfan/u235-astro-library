import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

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
}
  
export interface U235AstroEquatorialCoordinates {
    rightAscension: number;
    declination: number;
}

export interface U235AstroHorizontalCoordinates {
    azimuth: number;
    altitude: number;
}

export interface U235AstroRootHelper {
    solveY(x: number): number;
}

export interface U235AstroRootSolution {
    xRoot: number,
    yRoot: number,
    iterations: number
}
