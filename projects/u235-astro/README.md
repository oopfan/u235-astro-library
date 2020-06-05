# u235-astro

> This Angular library contains a collection of components, directives and classes that are useful for creating Astronomy applications.

Components include:

```html
<u235-astro-altitude [degrees]="galaxy.alt"></u235-astro-altitude>
<u235-astro-azimuth [degrees]="galaxy.az"></u235-astro-azimuth>
<u235-astro-hour-angle [hours]="galaxy.ha"></u235-astro-hour-angle>
<u235-astro-right-ascension [hours]="galaxy.ra"></u235-astro-right-ascension>
<u235-astro-declination [degrees]="galaxy.dec"></u235-astro-declination>
<u235-astro-latitude [degrees]="observer.lat"></u235-astro-latitude>
<u235-astro-longitude [degrees]="observer.lon"></u235-astro-longitude>
<u235-astro-time [hours]="observer.lmst"></u235-astro-time>
```

Directives include:

```html
[u235-astro-flash]="galaxy.altitudeChange.asObservable()"
```

Classes include:
```javascript
// U235AstroClock
// U235AstroObservatory
// U235AstroTarget

// Typical Usage:

clock = new U235AstroClock();
clock.date$ = interval(1000).pipe(map(() => new Date()));
clock.init();

observatory = new U235AstroObservatory();
// New York, NY:
observatory.latitude$ = of(40.78139);
observatory.longitude$ = of(-73.97389);
observatory.connect(clock);
observatory.init();

target = new U235AstroTarget();
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

Interfaces include:
```javascript
// U235AstroClockTick
// U235AstroEquatorialCoordinates
// U235AstroHorizontalCoordinates
// U235AstroFlashArg
```

## Sample Application
found here: 

sample code at the GitHub repo.
