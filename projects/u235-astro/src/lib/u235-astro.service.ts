import { Injectable } from '@angular/core';
import { U235AstroRootHelper, U235AstroRootSolution } from './u235-astro.interfaces';

@Injectable({
  providedIn: 'root'
})
export class U235AstroService {

  constructor() {}

  bisectionMethod(
    maxIterations: number,
    xTolerance: number,
    yTarget: number,
    xGuess1: number,
    xGuess2: number,
    helper: U235AstroRootHelper
  ): U235AstroRootSolution {

    const yGuess1 = helper.solveY(xGuess1);
    const yGuess2 = helper.solveY(xGuess2);
    const yError1 = yGuess1 - yTarget;
    const yError2 = yGuess2 - yTarget;
    if (Math.sign(yError1) == Math.sign(yError2)) {
      throw new Error('U235AstroService.bisectionMethod Error: supplied endpoints do not bracket the solution.');
    }
    return this._bisectionMethod(maxIterations, 1, xTolerance, yTarget, xGuess1, xGuess2, yError1, helper);
  }

  private _bisectionMethod(
    maxIterations: number,
    currIteration: number,
    xTolerance: number,
    yTarget: number,
    xGuess1: number,
    xGuess2: number,
    yError1: number,
    helper: U235AstroRootHelper
  ): U235AstroRootSolution {

    const xMidpoint = (xGuess1 + xGuess2) / 2;
    const yMidpoint = helper.solveY(xMidpoint);
    const yError = yMidpoint - yTarget;
    if (yError == 0 || (xGuess2 - xGuess1) / 2 < xTolerance) {
      return { xRoot: xMidpoint, yRoot: yMidpoint, iterations: currIteration };
    }
    if (currIteration >= maxIterations) {
      throw new Error(`U235AstroService.bisectionMethod Error: could not find solution after ${maxIterations} iterations.`);
    }
    if (Math.sign(yError) == Math.sign(yError1)) {
      xGuess1 = xMidpoint;
    }
    else {
      xGuess2 = xMidpoint;
    }
    return this._bisectionMethod(maxIterations, currIteration+1, xTolerance, yTarget, xGuess1, xGuess2, yError1, helper);
  }

  colorFluxAttenuation([colorBalance, extinction]: number[]): number {
    return 1 / 3 / colorBalance / extinction;
  }

  luminanceFluxAttenuation([redFluxAttenuation, greenFluxAttenuation, blueFluxAttenuation]: number[]): number {
    return redFluxAttenuation + greenFluxAttenuation + blueFluxAttenuation;
  }

  toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  // Uses the secant method for calculating airmass:
  calculateAirmass(altitudeDegrees: number): number {
    if (altitudeDegrees <= 0) {
      return Number.NaN;
    }
    const zenithAngle = 90 - Math.min(90, altitudeDegrees);
    const airmass = 1 / Math.cos(this.toRadians(zenithAngle));
    return airmass;
  }

  //////////////////////////////////////////////////////////////////////////
  // Extinction coefficients were derived from Al Kelly's table found here:
  // http://kellysky.net/White%20Balancing%20RGB%20Filters.pdf
  // A linear fit was made of his data points from altitude 30 to 90 degrees.
  // Excellent fit but with a drop-off in accuracy below 30 degrees.
  //
  calculateRedExtinction(airmass: number): number {
    const RxC = 0.9155 + 0.0845 * airmass;
    return RxC;
  }
  calculateGreenExtinction(airmass: number): number {
    const GxC = 0.8303 + 0.1697 * airmass;
    return GxC;
  }
  calculateBlueExtinction(airmass: number): number {
    const BxC = 0.7554 + 0.2446 * airmass;
    return BxC;
  }
  //////////////////////////////////////////////////////////////////////////

  encodeAngleToMath(dec: number[]): number {
    // Converts a decoded angle to decimal degrees.
    //  dec is an array of five integers:
    //  dec[0] is sign: -1 or 1
    //  dec[1] is degrees: 0 to 360
    //  dec[2] is minutes: 0 to 59
    //  dec[3] is seconds: 0 to 59
    //  dec[4] is microseconds: 0 to 999999
    const arcusec = ((dec[4] + (dec[3] + (dec[2] + dec[1] * 60) * 60) * 1000000) * dec[0]);
    return arcusec / (60 * 60 * 1000000);
  }

  decodeAngleFromMath(enc: number): number[] {
    // Unpacks an angle (see function 'encodeAngleToMath')
    let sign = 1;
    if (enc < 0) {
        sign = -1;
        enc = -enc;
    }
    enc = Math.trunc(enc * (60 * 60 * 1000000));
    const usec = enc % 1000000;
    enc = (enc - usec) / 1000000;
    const sec = enc % 60;
    enc = (enc - sec) / 60;
    const min = enc % 60;
    enc = (enc - min) / 60;
    const deg = enc;
    return [sign, deg, min, sec, usec];
  }

  encodeAngleToStorage(dec: number[]): number {
    // Packs an angle into a Javascript Number object.
    // This is a loss-less implementation using powers of 2.
    //  dec is an array of five integers:
    //  dec[0] is sign: -1 or 1
    //  dec[1] is degrees: 0 to 360
    //  dec[2] is minutes: 0 to 59
    //  dec[3] is seconds: 0 to 59
    //  dec[4] is microseconds: 0 to 999999
    // Example:
    //  Input: [-1, 73, 50, 17, 600000]
    //  Output: -316906481600 (wrong, must update)
    //  which represents the longitude of home at 73 deg 50 min 17.6 sec West
    var sign = dec[0] > 0 ? 1 : 0;
    var enc = (dec[4] + (dec[3] + (dec[2] + dec[1] * 64) * 64) * 1048576) * 2 + sign;
    return enc;
  }

  decodeAngleFromStorage(enc: number): number[] {
    // Unpacks an angle (see function 'encodeAngleToStorage')
    // Example:
    //  Input: -316906481600 (wrong, must update)
    //  Output: [-1, 73, 50, 17, 600000]
    //  which represents the longitude of home at 73 deg 50 min 17.6 sec West
    var sign = enc % 2;
    enc = (enc - sign) / 2;
    var usec = enc % 1048576;
    enc = (enc - usec) / 1048576;
    var sec = enc % 64;
    enc = (enc - sec) / 64;
    var min = enc % 64;
    enc = (enc - min) / 64;
    var deg = enc;
    sign = sign > 0 ? 1 : -1;
    return [sign, deg, min, sec, usec];
  }

}
