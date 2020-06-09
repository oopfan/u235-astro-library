# u235-astro

> This Angular library contains a collection of components, directives and classes that are useful for creating Astronomy applications.

Components include:

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

Directives include:

```html
[u235-astro-flash]="altitudeChange.asObservable()"
```

Interfaces include:
```javascript
U235AstroClockTick
U235AstroEquatorialCoordinates
U235AstroHorizontalCoordinates
U235AstroFlashArg
```

Classes include:
```javascript
// Uses RxJs Observables:
U235AstroClock
U235AstroObservatory
U235AstroTarget
```

Sample Implementation:
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
// The star Vega:
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
```
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

Component **```u235-astro-altitude```** displays the given altitude in the following format: *[+/-]dd&deg; mm'*
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

Component **```u235-astro-azimuth```** displays the given azimuth in the following format: *+ddd&deg; mm'*
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

Component **```u235-astro-hour-angle```** displays the given hour angle in the following format: *hh<sup>h</sup> mm<sup>m</sup> [E/W]*
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

Component **```u235-astro-right-ascension displays```** the given right ascension in the following format: *hh<sup>h</sup> mm<sup>m</sup> ss<sup>s</sup>*
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

Component **```u235-astro-declination displays```** the given declination in the following format: *[+/-]dd&deg; mm' ss"*
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

Component **```u235-astro-latitude```** displays the given latitude in the following format: *dd&deg; mm' ss" [N/S]*
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

Component **```u235-astro-longitude```** displays the given longitude in the following format: *ddd&deg; mm' ss" [E/W]*
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

Component **```u235-astro-time```** displays the given time in the following 24-hour format: *hh:mm:ss*
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

Directive **```u235-astro-flash```** gives a visual cue in the form of a blue background color flash to indicate that an observed value changed.
```html
[u235-astro-flash]="subject.asObservable()"
```
* **```subject```** is an RxJs Subject. Your client code will call the next() method to trigger the directive to flash the DOM element.
* The **```next()```** method accepts an argument of type **```U235AstroFlashArg```**. It is an object having two properties: **```backgroundColor```** and **```transitionDuration```**. Both are optional. To keep the defaults pass an empty object to the method, that is **```next({})```**. backgroundColor can be a string like 'red' or 'green' or a color value; the default is '#70b5ff' which is a light steel blue. transitionDuration defaults to '0.4s'.

Interfaces
```javascript
// Controls flash properties (see docs for u235-astro-flash)
export interface U235AstroFlashArg {
    backgroundColor?: string,
    transitionDuration?: string
}

// Emitted by clockTick$ Observable of U235AstroClock
export interface U235AstroClockTick {
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
export interface U235AstroEquatorialCoordinates {
    rightAscension: number;
    declination: number;
}

// Emitted by horNow$ Observable of U235AstroTarget
export interface U235AstroHorizontalCoordinates {
    azimuth: number;
    altitude: number;
}
```

Classes
```javascript
U235AstroClock
U235AstroObservatory
U235AstroTarget
```
* Please refer to the **```Sample implementation```** farther up in this document. Also look at the full-featured app in the GitHub repo. It will show advanced usage.
* Notice the event flow: **```U235AstroClock```** drives **```U235AstroObservatory```**, and **```U235AstroObservatory```** drives **```U235AstroTarget```**.
* Notice the calls to **```connect()```** between objects.
* Notice the call to **```init()```**. It wires-up the logic between the inputs and outputs. Call this after connect().
* Notice how inputs are defined before calling connect() or init().
* Tip: Open up the developer's console of your browser while developing code. Look for messages like 'Requires...". This is a warning telling you that you subscribed to an output that depends on an input that was not defined.
