# u235-astro

> This Angular library contains a collection of components, directives and classes that are
useful for creating Astronomy applications. The library calculates the position of the Sun
and planets using Standish orbital elements for elliptical orbits, and solving Kepler's
equation. The Moon's position is high-precision by Schlyter. For other objects like stars,
galaxies, and nebulae you may directly enter J2000 catalog coordinates (see sample
applications below).

> PRECESSION: The library does not adjust for Nutation, which is the short-period motion of
the true pole around the mean pole with an amplitude of about 9 arc-seconds and a variety of
periods of up to 18.6 years, however it does adjust for lunisolar precession, which is the
smooth long-period motion of the mean pole of the equator about the pole of the ecliptic
with a period of about 26,000 years.

> TIMESCALES: Planetary orbits and Earth's rotation are calculated using the same time,
therefore the library considers Terrestrial Time (TT) and Universal Time (UT1) the same.

> ACCURACY: As E.M.Standish of JPL/Caltech writes: "Lower accuracy formulae for planetary
positions have a number of important applications when one doesn't need the full accuracy
of an integrated ephemeris. They are often used in observation scheduling, telescope
pointing, and prediction of certain phenomena as well as the planning and design of
spacecraft missions." As Brian Morgan, the author of this Angular library writes:
"Personally I have used these functions since 2016. The position of the inner planets is
quite accurate, within a dozen arc-seconds when compared to an ephemeris. The outer planets
suffer some loss of accuracy, most notably Saturn, which is off by about 3 arc-minutes as of
this writing. Still however this is good enough for telescope pointing. As anecdotal
evidence I designed a visualization tool using this library to virtually watch solar eclipses
from home when I can't be there in person. I'll run the tool side-by-side with streaming
video from the site. The mathematical progress of the eclipse with the tool is remarkably
similar to what unfolds on the ground."

## Release Notes

### Version 1.1.1
* Modify *U235AstroSNR*, reactive variant. *darkSignalPerSub$* needed to be a function of
*binning$*.

### Version 1.1.0
* New *u235-astro-moon-phase* component. Add it to your markup with no arguments to display
a 100px x 100px image of the Moon shown with the current phase. Every minute the image will
update as the Moon and Sun change astronomical position. Optionally, you can specify four
arguments. Please refer to the component's description for argument details.

### Version 1.0.1
* Bug fix: The transform between J2000 ecliptic and equatorial coordinates used an
incorrect value for the obliquity of the ecliptic.

### Version 1.0.0
* Observable names changed to indicate the coordinate system, origin, and epoch:
    1. *2000* indicates catalog coordinates for J2000.
    1. *Now* indicates coordinates transformed for precession since J2000.
    1. *Geo* indicates *Geocentric* coordinates relative to the Earth's center.
    1. *Topo* indicates *Topocentric* coordinates relative to an observer on the Earth's surface.
    1. *Equ* indicates *Equatorial* coordinates relative to the Earth's equator projected into space.
    1. *Ecl* indicates *Ecliptic* coordinates relative to the plane of the Earth's orbit.
    1. *Hor* indicates *Horizontal* coordinates relative to points on the compass and degrees above the horizon.
* Many more observables added to the *U235AstroTarget* class:
    1. Input *geoEqu2000$* replaces *equ2000$*.
    1. Output *geoEquNow$* replaces *equNow$*.
    1. Output *topoEqu2000$* added.
    1. Output *topoEquNow$* added.
    1. Output *geoEcl2000$* added.
    1. Output *geoEclNow$* added.
    1. Output *topoEcl2000$* added.
    1. Output *topoEclNow$* added.
    1. Output *geoHor2000$* added.
    1. Output *geoHorNow$* added.
    1. Output *topoHor2000$* added.
    1. Output *topoHorNow$* replaces *horNow$*.
    1. Output *hourAngle$* remains but know that it now uses *topoEquNow$*.
    1. Note that the difference between *geocentric* and *topocentric* coordinates mostly affects nearby targets
    like the Moon. For distant objects there is not much impact moving from the Earth's center to its surface.
* Changes to interfaces:
    1. *earthHelEcl2000* property removed from *U235AstroClockTick* interface.
    1. *U235AstroEclipticCoordinates* interface added.
    1. *distance* property added to *U235AstroEquatorialCoordinates*, *U235AstroEclipticCoordinates*, and
    *U235AstroHorizontalCoordinates* interfaces. Units of measurement are *Astronomical Units*.
    1. *distance* is calculated for the Sun, Moon, and Planets, however if your application wants to track
    other objects like stars, galaxies or nebulae then you will enter the catalog coordinates yourself. In
    this case leave the *distance* property undefined. This indicates to the library that the target is a
    very great distance away. For whatever reason if your application can not leave it undefined that use a
    large number like 1000 but don't use Number.Infinity.
* Changes to *U235AstroObservatory* class:
    1. *matHorToEqu$* output observable added.
* Changes to *U235AstroReactiveSchlyterMoon* class:
    1. *equ2000$* output observable renamed to *geoEqu2000$*.
* Changes to *U235AstroReactiveSolarSystem* class:
    1. *sunEqu2000$* output observable renamed to *sunGeoEqu2000$*.
    1. *mercuryEqu2000$* output observable renamed to *mercuryGeoEqu2000$*.
    1. *venusEqu2000$* output observable renamed to *venusGeoEqu2000$*.
    1. *marsEqu2000$* output observable renamed to *marsGeoEqu2000$*.
    1. *jupiterEqu2000$* output observable renamed to *jupiterGeoEqu2000$*.
    1. *saturnEqu2000$* output observable renamed to *saturnGeoEqu2000$*.
    1. *uranusEqu2000$* output observable renamed to *uranusGeoEqu2000$*.
    1. *neptuneEqu2000$* output observable renamed to *neptuneGeoEqu2000$*.
    1. *plutoEqu2000$* output observable renamed to *plutoGeoEqu2000$*.

### Version 0.0.10
* Altitude and Azimuth are now relative to the Observatory's location on the Earth's surface. All other
coordinates including Right Ascension and Declination remain relative to the Earth's center. This change
mostly affected the position of the Moon.

### Version 0.0.9 and earlier
* Altitude and Azimuth were calculated relative to the Earth's center.

## How to use?
```javascript
import { U235AstroModule } from 'u235-astro';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    U235AstroModule // <-- add the module in imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
## Documentation

### Components:
```html
<u235-astro-altitude [degrees]="altitude"></u235-astro-altitude>
<u235-astro-azimuth [degrees]="azimuth"></u235-astro-azimuth>
<u235-astro-declination [degrees]="declination"></u235-astro-declination>
<u235-astro-hour-angle [hours]="hourAngle"></u235-astro-hour-angle>
<u235-astro-latitude [degrees]="latitude"></u235-astro-latitude>
<u235-astro-longitude [degrees]="longitude"></u235-astro-longitude>
<u235-astro-moon-phase (four optional arguments, see description)></u235-astro-moon-phase>
<u235-astro-right-ascension [hours]="rightAscension"></u235-astro-right-ascension>
<u235-astro-time [hours]="sideralTime"></u235-astro-time>
```
* See section: Component Details

### Directives:
```html
[u235-astro-flash]="altitudeChange.asObservable()"
```
* See section: Directive Details

### Interfaces:
```javascript
// Emitted via notify() of u235-astro-moon-phase component
interface U235AstroMoonPhaseStats {
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

// Emitted by clockTick$ Observable of U235AstroClock
interface U235AstroClockTick {
    date: Date,             // Date at moment
    dayFraction: number,    // UTC date fraction
    jd0: number,            // Julian Date at 0h UTC
    jd: number,             // Julian Date at moment
    gmst0: number,          // Greenwich Sidereal Time at 0h UTC
    gmst: number,           // Greenwich Sidereal Time at moment
    obliquityOfEcliptic: number,    // Inclination of Earth's equator
    precessionSinceJ2000: number,   // Precession in degrees
    matEquToEcl: U235AstroMatrix3D, // Transform Equ to Ecl coords.
    matEclToEqu: U235AstroMatrix3D, // Transform Ecl to Equ coords.
    matPrecessToDate: U235AstroMatrix3D, // Precess from J2000 to Date
    matPrecessFromDate: U235AstroMatrix3D;  // Precess from Date to J2000
}

// Emitted by several Observables of U235AstroTarget
interface U235AstroEquatorialCoordinates {
    rightAscension: number;     // Hours
    declination: number;        // Degrees
    distance?: number;          // Astronomical Units (AU)
}

// Emitted by several Observables of U235AstroTarget
interface U235AstroEclipticCoordinates {
    latitude: number;           // Degrees
    longitude: number;          // Degrees
    distance: number;           // Astronomical Units (AU)
}

// Emitted by several Observables of U235AstroTarget
interface U235AstroHorizontalCoordinates {
    azimuth: number;            // Degrees
    altitude: number;           // Degrees
    distance: number;           // Astronomical Units (AU)
}

// Controls flash properties (see docs for u235-astro-flash)
interface U235AstroFlashArg {
    backgroundColor?: string,
    transitionDuration?: string
}

// Your model should implement this interface when you want to
// perform root finding (see bisectionMethod in U235AstroService)
interface U235AstroRootHelper {
    solveY(x: number): number;
}

// Emitted upon successful completion of the bisectionMethod
interface U235AstroRootSolution {
    xRoot: number,
    yRoot: number,
    iterations: number
}
```

### Classes:
```javascript
// Reactive:
class U235AstroClock {
    // Inputs:
    date$: Observable<Date>;
    // Outputs:
    clockTick$: Observable<U235AstroClockTick>;
    // Methods:
    init();
}

// Reactive:
class U235AstroObservatory {
    // Inputs:
    name$: Observable<string>;
    latitude$: Observable<number>;
    longitude$: Observable<number>;
    clockTick$: Observable<U235AstroClockTick>;
    // Outputs:
    lmst$: Observable<number>;
    matEquToHor$: Observable<U235AstroMatrix3D>;
    matHorToEqu$: Observable<U235AstroMatrix3D>;
    // Methods:
    connect(clock: U235AstroClock);
    init();
}

// Reactive:
class U235AstroTarget {
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
    // Methods:
    connect(observatory: U235AstroObservatory);
    init();
}

// Reactive:
class U235AstroReactiveSolarSystem {
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
    // Methods:
    connect(clock: U235AstroClock);
    init();
}

// Reactive:
class U235AstroReactiveSchlyterMoon {
    // Inputs:
    clockTick$: Observable<U235AstroClockTick>;
    // Outputs:
    geoEqu2000$: Observable<U235AstroEquatorialCoordinates>;
    // Methods:
    connect(clock: U235AstroClock);
    init();
}

// Reactive:
class U235AstroSNR {
    // Inputs:
    fluxAttenuation$: Observable<number>;
    aperture$: Observable<number>;
    focalLength$: Observable<number>;
    centralObstruction$: Observable<number>;
    totalReflectanceTransmittance$: Observable<number>;
    pixelSize$: Observable<number>;
    binning$: Observable<number>;
    surfaceBrightness$: Observable<number>;
    readNoise$: Observable<number>;
    darkCurrent$: Observable<number>;
    quantumEfficiency$: Observable<number>;
    skyBrightness$: Observable<number>;
    exposure$: Observable<number>;
    // Outputs:
    clearApertureEquivalent$: Observable<number>;
    imageResolution$: Observable<number>;
    pixelSurface$: Observable<number>;
    targetElectronsPerSecond$: Observable<number>;
    targetElectronsPerSub$: Observable<number>;
    shotNoise$: Observable<number>;
    skyElectronsPerSecond$: Observable<number>;
    skyElectronsPerSub$: Observable<number>;
    skyNoise$: Observable<number>;
    darkSignalPerSub$: Observable<number>;
    darkNoise$: Observable<number>;
    totalNoisePerSub$: Observable<number>;
    signalToNoisePerSub$: Observable<number>;
    // Methods:
    init();
}

// Synchronous implementation of U235AstroSNR.
// Use it to perform root finding (see U235AstroService.bisectionMethod).
class U235AstroSyncSNR {
    setFluxAttenuation(value: number);
    setAperture(value: number);
    setFocalLength(value: number);
    setCentralObstruction(value: number);
    setTotalReflectanceTransmittance(value: number);
    setPixelSize(value: number);
    setBinning(value: number);
    setSurfaceBrightness(value: number);
    setReadNoise(value: number);
    setDarkCurrent(value: number);
    setQuantumEfficiency(value: number);
    setSkyBrightness(value: number);
    setExposure(value: number);
    setNumberOfSubs(value: number);

    getFluxAttenuation(): number;
    getAperture(): number;
    getFocalLength(): number;
    getCentralObstruction(): number;
    getTotalReflectanceTransmittance(): number;
    getPixelSize(): number;
    getBinning(): number;
    getSurfaceBrightness(): number;
    getReadNoise(): number;
    getDarkCurrent(): number;
    getQuantumEfficiency(): number;
    getSkyBrightness(): number;
    getExposure(): number;
    getNumberOfSubs(): number;

    getClearApertureEquivalent(): number;
    getImageResolution(): number;
    getPixelSurface(): number;
    getTargetElectronsPerSecond(): number;
    getTargetElectronsPerSub(): number;
    getShotNoise(): number;
    getSkyElectronsPerSecond(): number;
    getSkyElectronsPerSub(): number;
    getSkyNoise(): number;
    getDarkSignalPerSub(): number;
    getDarkNoise(): number;
    getTotalNoisePerSub(): number;
    getSignalToNoisePerSub(): number;
    getTotalSignalToNoiseOfStack(): number;
    getTotalIntegrationTime(): number;
}

// Used internally but you can use them too:
class U235AstroVector3D;
class U235AstroMatrix3D;
```

### Service:
```javascript
class U235AstroService {
    // Commonly used functions:
    toRadians(degrees: number): number;
    toDegrees(radians: number): number;
    calculateAirmass(altitudeDegrees: number): number;
    calculateRedExtinction(airmass: number): number;
    calculateGreenExtinction(airmass: number): number;
    calculateBlueExtinction(airmass: number): number;
    encodeAngleToMath(dec: number[]): number;
    decodeAngleFromMath(enc: number): number[];
    encodeAngleToStorage(dec: number[]): number;
    decodeAngleFromStorage(enc: number): number[];
    colorFluxAttenuation([colorBalance, extinction]: number[]): number;
    luminanceFluxAttenuation([redFluxAttenuation, greenFluxAttenuation, blueFluxAttenuation]: number[]): number;

    // Bisection Method for root finding:
    bisectionMethod(
        maxIterations: number,
        xTolerance: number,
        yTarget: number,
        xGuess1: number,
        xGuess2: number,
        helper: U235AstroRootHelper
    ): U235AstroRootSolution;
}
```

### Code Samples:

### Sample 1: Calculate the altitude and azimuth of the star Vega as seen from New York City at this very moment
```javascript
import { interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { U235AstroClock, U235AstroObservatory, U235AstroTarget} from 'u235-astro';

const clock = new U235AstroClock();
clock.date$ = interval(1000).pipe(map(() => new Date()));
clock.init();

const observatory = new U235AstroObservatory();
// New York, NY:
observatory.latitude$ = of(40.78139);
observatory.longitude$ = of(-73.97389);
observatory.connect(clock);
observatory.init();

const target = new U235AstroTarget();
// Vega:
target.equ2000$ = of({
    rightAscension: 18.61556,
    declination: 38.78361
});
target.connect(observatory);
target.init();

target.topoHorNow$.subscribe(value => {
    console.log('Azimuth:', value.azimuth);
    console.log('Altitude:', value.altitude);
});
// Output updates every second, for example:
// Azimuth: 104.179047
// Altitude: 53.014798
```
* Notice how **```U235AstroClock```** drives **```U235AstroObservatory```**, and **```U235AstroObservatory```** drives **```U235AstroTarget```**.
* Notice the calls to **```connect()```** between objects.
* Notice the call to **```init()```**. It wires-up the logic between the inputs and outputs. Call this after connect().
* Notice how inputs are defined before calling connect() or init().
* Tip: Open up the developer's console of your browser while developing code. Look for messages like 'Requires...". This is a warning telling you that you subscribed to an output that depends on an input that was not defined.

### Sample 2: Calculate the signal-to-noise ratio of the galaxy M81 under Bortle 5 skies using an Atik 314E CCD and William Optics ZenithStar 71, using a 90-second exposure
```javascript
import { of } from 'rxjs';
import { U235AstroSNR } from 'u235-astro';

const snrModel = new U235AstroSNR();

// William Optics ZenithStar 71:
snrModel.aperture$ = of(71);
snrModel.focalLength$ = of(418);
snrModel.centralObstruction$ = of(0);
snrModel.totalReflectanceTransmittance$ = of(0.99);
// Atik 314E:
snrModel.pixelSize$ = of(4.65);
snrModel.readNoise$ = of(5.3);
snrModel.darkCurrent$ = of(0.1);
snrModel.quantumEfficiency$ = of(43);
// Bortle 5:
snrModel.skyBrightness$ = of(20.02);
// M81:
snrModel.surfaceBrightness$ = of(21.7);
// Exposure:
snrModel.fluxAttenuation$ = of(1);  // assume zenith and unity relative QE
snrModel.binning$ = of(1);
snrModel.exposure$ = of(90);
snrModel.init();

snrModel.signalToNoisePerSub$.subscribe(value => console.log(`SNR per sub: ${value}`));
// Output:
// SNR per sub: 1.3354560781189644
```

### Sample 3: Calculate the square root of 2 using the Bisection Method
```javascript
import { U235AstroRootHelper, U235AstroService } from 'u235-astro';

// Inject U235AstroService into your app component:
constructor(private utility: U235AstroService) {}

class SquareRoot implements U235AstroRootHelper {
    squareRootOf: number;
    constructor(squareRootOf: number) { this.squareRootOf = squareRootOf; }
    solveY(x: number): number {
        return x*x - this.squareRootOf;
    }
}

const squareRootOf = 2;
const helper = new SquareRoot(squareRootOf);
const maxIterations = 20;
const xTolerance = 0.0001;
const yTarget = 0;
const xGuess1 = 1;
const xGuess2 = 2;

try {
    const answer = this.utility.bisectionMethod(maxIterations, xTolerance, yTarget, xGuess1, xGuess2, helper);
    console.log(`Square root of ${squareRootOf} is ${answer.xRoot.toFixed(3)} after ${answer.iterations} iterations.`);
}
catch(e) {
    // Possibility of two errors:
    //  'U235AstroService.bisectionMethod Error: supplied endpoints do not bracket the solution.'
    //  'U235AstroService.bisectionMethod Error: could not find solution after <maxIterations> iterations.'
    console.error('Error', e.message);
}

// Output:
// Square root of 2 is 1.414 after 14 iterations.
```

## Component Details

### **```u235-astro-moon-phase```** displays a 100px x 100px image of the Moon shown with the current phase
```html
<u235-astro-moon-phase
    [date-fixed]="aJavascriptDate"
    [date-offset]="millisecondsFromDate"
    [box-size]="boxSize"
    (notify)="onChange($event)"
></u235-astro-moon-phase>
```
* All arguments are optional. The default behavior is to display a 100px x 100px image of
the Moon shown with the current phase. Every minute the image will update as the Moon and
Sun change astronomical position.
* **```[date-fixed]```** overrides the default update behavior. The given Javascript object
selects the displayed phase. It will no longer update once per minute.
* **```[date-offset]```** is the number of milliseconds added to the current date. The default
is zero. If *date-fixed* is specified then *date-offset* is added to it before performing
the phase calculation.
* **```[box-size]```** scales the image to the given width and height. The image is square
so only one argument is needed.
* **```(notify)```** is a user-function that is called when the image is updated. It contains
useful information that your application can use to display the current illuminated percent
of the Moon's disc, for example. See the *Interfaces* section for the definition of
U235AstroMoonPhaseStats.

### **```u235-astro-altitude```** displays the given altitude in the following format: *[+/-]dd&deg; mm'*
```html
<u235-astro-altitude
    [degrees]="altitude"
    (notifyChange)="onAltitudeChange()"
    [u235-astro-flash]="altitudeChange.asObservable()"
></u235-astro-altitude>
```
* **```[degrees]```** is a decimal number between -90 and +90. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [degrees] changes. The method will only be called when the value changes by the displayed precision: arc-minutes.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-azimuth```** displays the given azimuth in the following format: *+ddd&deg; mm'*
```html
<u235-astro-azimuth
    [degrees]="azimuth"
    (notifyChange)="onAzimuthChange()"
    [u235-astro-flash]="azimuthChange.asObservable()"
></u235-astro-azimuth>
```
* **```[degrees]```** is a decimal number between 0 and 360. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [degrees] changes. The method will only be called when the value changes by the displayed precision: arc-minutes.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-hour-angle```** displays the given hour angle in the following format: *hh<sup>h</sup> mm<sup>m</sup> [E/W]*
```html
<u235-astro-hour-angle
    [hours]="hourAngle"
    (notifyChange)="onHourAngleChange()"
    [u235-astro-flash]="hourAngleChange.asObservable()"
></u235-astro-hour-angle>
```
* **```[hours]```** is a decimal number from -12 to +12. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [hours] changes. The method will only be called when the value changes by the displayed precision: minutes.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-right-ascension displays```** the given right ascension in the following format: *hh<sup>h</sup> mm<sup>m</sup> ss<sup>s</sup>*
```html
<u235-astro-right-ascension
    [hours]="rightAscension"
    (notifyChange)="onRightAscensionChange()"
    [u235-astro-flash]="rightAscensionChange.asObservable()"
></u235-astro-right-ascension>
```
* **```[hours]```** is a decimal number from 0 to 24. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [hours] changes. The method will only be called when the value changes by the displayed precision: seconds.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-declination displays```** the given declination in the following format: *[+/-]dd&deg; mm' ss"*
```html
<u235-astro-declination
    [degrees]="declination"
    (notifyChange)="onDeclinationChange()"
    [u235-astro-flash]="declinationChange.asObservable()"
></u235-astro-declination>
```
* **```[degrees]```** is a decimal number from -90 to +90. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [degrees] changes. The method will only be called when the value changes by the displayed precision: arc-seconds.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-latitude```** displays the given latitude in the following format: *dd&deg; mm' ss" [N/S]*
```html
<u235-astro-latitude
    [degrees]="latitude"
    (notifyChange)="onLatitudeChange()"
    [u235-astro-flash]="latitudeChange.asObservable()"
></u235-astro-latitude>
```
* **```[degrees]```** is a decimal number from -90 to +90. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [degrees] changes. The method will only be called when the value changes by the displayed precision: arc-seconds.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-longitude```** displays the given longitude in the following format: *ddd&deg; mm' ss" [E/W]*
```html
<u235-astro-longitude
    [degrees]="longitude"
    (notifyChange)="onLongitudeChange()"
    [u235-astro-flash]="longitudeChange.asObservable()"
></u235-astro-longitude>
```
* **```[degrees]```** is a decimal number from -180 to +180. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [degrees] changes. The method will only be called when the value changes by the displayed precision: arc-seconds.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

### **```u235-astro-time```** displays the given time in the following 24-hour format: *hh:mm:ss*
```html
<u235-astro-time
    [hours]="siderealTime"
    (notifyChange)="onTimeChange()"
    [u235-astro-flash]="timeChange.asObservable()"
></u235-astro-time>
```
* **```[hours]```** is a decimal number from 0 to 24. If the value falls outside that range it is clipped.
* **```(notifyChange)```** is optional. The component will call your method whenever [hours] changes. The method will only be called when the value changes by the displayed precision: seconds.
* **```[u235-astro-flash]```** is optional. It may be used to give a visual cue in the form of a blue background color flash to indicate that the value changed. See the documentation for 'u235-astro-flash' for usage details.

## Directive Details

### **```u235-astro-flash```** gives a visual cue in the form of a blue background color flash to indicate that an observed value changed.
```html
[u235-astro-flash]="subject.asObservable()"
```
* **```subject```** is an RxJs Subject. Your client code will call the next() method to trigger the directive to flash the DOM element.
* The **```next()```** method accepts an argument of type **```U235AstroFlashArg```**. It is an object having two properties: **```backgroundColor```** and **```transitionDuration```**. Both are optional. To keep the defaults pass an empty object to the method, that is **```next({})```**. backgroundColor can be a string like 'red' or 'green' or a color value; the default is '#70b5ff' which is a light steel blue. transitionDuration defaults to '0.4s'.
