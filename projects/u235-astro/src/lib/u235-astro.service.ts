import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class U235AstroService {

  constructor() { }

  // Uses the secant method for calculating airmass:
  calculateAirmass(altitudeDegrees: number): number {
    if (altitudeDegrees <= 0) {
      return Number.NaN;
    }
    const zenithAngle = 90 - Math.min(90, altitudeDegrees);
    const airmass = 1 / Math.cos(zenithAngle / 180 * Math.PI);
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

}
