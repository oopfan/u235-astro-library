# u235-astro

> This Angular library contains a collection of components, directives and classes that are useful for creating Astronomy applications.

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
<u235-astro-hour-angle [hours]="hourAngle"></u235-astro-hour-angle>
<u235-astro-right-ascension [hours]="rightAscension"></u235-astro-right-ascension>
<u235-astro-declination [degrees]="declination"></u235-astro-declination>
<u235-astro-latitude [degrees]="latitude"></u235-astro-latitude>
<u235-astro-longitude [degrees]="longitude"></u235-astro-longitude>
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
    matPrecessToDate: U235AstroMatrix3D // Precession Transform
}

// Emitted by equ2000$ and equNow$ Observables of U235AstroTarget  
interface U235AstroEquatorialCoordinates {
    rightAscension: number;
    declination: number;
}

// Emitted by horNow$ Observable of U235AstroTarget
interface U235AstroHorizontalCoordinates {
    azimuth: number;
    altitude: number;
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
    // Methods:
    connect(clock: U235AstroClock);
    init();
}

// Reactive:
class U235AstroTarget {
    // Inputs:
    name$: Observable<string>;
    equ2000$: Observable<U235AstroEquatorialCoordinates>;
    clockTick$: Observable<U235AstroClockTick>;
    matEquToHor$: Observable<U235AstroMatrix3D>;
    lmst$: Observable<number>;
    // Outputs:
    equNow$: Observable<U235AstroEquatorialCoordinates>;
    horNow$: Observable<U235AstroHorizontalCoordinates>;
    hourAngle$: Observable<number>;
    // Methods:
    connect(observatory: U235AstroObservatory);
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

target.horNow$.subscribe(value => {
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
