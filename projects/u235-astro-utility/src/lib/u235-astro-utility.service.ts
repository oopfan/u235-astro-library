import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class U235AstroUtilityService {

  constructor() { }

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
