import { Component, OnInit } from '@angular/core';
import { interval, Subject, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  U235AstroMoonPhaseStats, U235AstroFlashArg, U235AstroClock, U235AstroObservatory, U235AstroTarget, U235AstroSNR,
  U235AstroRootHelper, U235AstroService, U235AstroSyncSNR, U235AstroReactiveSolarSystem, U235AstroReactiveSchlyterMoon
} from 'u235-astro';

class MyMoonPhase {
  dateOffset: number;
  date: Date;
  phase: string;
  illumination: number;

  constructor(dateOffset: number = 0) { this.dateOffset = dateOffset; }

  onChange(value: U235AstroMoonPhaseStats) {
    this.date = value.date;
    this.phase = value.phaseName;
    this.illumination = value.illuminationPct;
  }

}

class MyTarget extends U235AstroTarget {
  azimuthChange = new Subject<U235AstroFlashArg>();
  altitudeChange = new Subject<U235AstroFlashArg>();
  hourAngleChange = new Subject<U235AstroFlashArg>();

  constructor() {
    super();
  }

  onAzimuthChange() {
    this.azimuthChange.next({});
  }

  onAltitudeChange() {
    this.altitudeChange.next({});
    // this.altitudeChange.next({ backgroundColor: 'red' });
  }

  onHourAngleChange() {
    this.hourAngleChange.next({});
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  encode = (degree: number, minute: number, second: number): number => {
    return degree + (minute + second / 60) / 60;
  }
  
  sites = [
    {
      name: 'New York, NY',
      latitude: this.encode(40, 46, 53),
      longitude: -this.encode(73, 58, 26)
    },
    {
      name: 'London, UK',
      latitude: this.encode(51, 31, 10),
      longitude: -this.encode(0, 7, 37)
    }
  ];

  celestialObjects = [
    {
      name: 'Polaris',
      ra2000: this.encode(2, 31, 54),
      de2000: this.encode(89, 15, 51)
    },
    // {
    //   name: 'Vega',
    //   ra2000: this.encode(18, 36, 56),
    //   de2000: this.encode(38, 47, 1)
    // },
    // {
    //   name: 'M13',
    //   ra2000: this.encode(16, 41, 42),
    //   de2000: this.encode(36, 27, 39)
    // },
    // {
    //   name: 'M27',
    //   ra2000: this.encode(19, 59, 36),
    //   de2000: this.encode(22, 43, 18)
    // },
    // {
    //   name: 'M57',
    //   ra2000: this.encode(18, 53, 35),
    //   de2000: this.encode(33, 1, 47)
    // }
  ]

  clock = new U235AstroClock();
  observatories: U235AstroObservatory[] = [];
  solarSystem = new U235AstroReactiveSolarSystem();
  moon = new U235AstroReactiveSchlyterMoon();

  moonPhases: MyMoonPhase[] = [];
  targets: MyTarget[][] = [];

  constructor(private utility: U235AstroService) {}

  ngOnInit(): void {
    for (let index = 0; index < 30; index++) {
      const moonPhase = new MyMoonPhase(index * 1000*60*60*24);
      this.moonPhases.push(moonPhase);
    }

    this.clock.date$ = interval(1000).pipe(startWith(0), map(() => new Date()));
    this.clock.init();
    this.solarSystem.connect(this.clock);
    this.solarSystem.init();
    this.moon.connect(this.clock);
    this.moon.init();

    for (let site of this.sites) {
      const observatory = new U235AstroObservatory();
      observatory.name$ = of(site.name);
      observatory.latitude$ = of(site.latitude);
      observatory.longitude$ = of(site.longitude);
      observatory.connect(this.clock);
      observatory.init();
      this.observatories.push(observatory);
      const targets: MyTarget[] = [];

      for (let object of this.celestialObjects) {
        const target = new MyTarget();
        target.name$ = of(object.name);
        target.geoEqu2000$ = of({
          rightAscension: object.ra2000,
          declination: object.de2000
        });
        target.connect(observatory);
        target.init();
        targets.push(target);
      }

      const moonTarget = new MyTarget();
      moonTarget.name$ = of('Moon');
      moonTarget.geoEqu2000$ = this.moon.geoEqu2000$;
      moonTarget.connect(observatory);
      moonTarget.init();
      targets.push(moonTarget);

      const bodies = [
        { name: 'Sun', measure: 'sunGeoEqu2000$' },
        { name: 'Mercury', measure: 'mercuryGeoEqu2000$' },
        { name: 'Venus', measure: 'venusGeoEqu2000$' },
        { name: 'Mars', measure: 'marsGeoEqu2000$' },
        { name: 'Jupiter', measure: 'jupiterGeoEqu2000$' },
        { name: 'Saturn', measure: 'saturnGeoEqu2000$' },
        { name: 'Uranus', measure: 'uranusGeoEqu2000$' },
        { name: 'Neptune', measure: 'neptuneGeoEqu2000$' },
        { name: 'Pluto', measure: 'plutoGeoEqu2000$' },
      ];
      for (let body of bodies) {
        const target = new MyTarget();
        target.name$ = of(body.name);
        target.geoEqu2000$ = this.solarSystem[body.measure];
        target.connect(observatory);
        target.init();
        targets.push(target);
      }
      this.targets.push(targets);
    }

    // this.testTransform();
    // this.testSNR();
    // this.testRoot1();
    // this.testRoot2();
    // this.testDate();
  }

  testTransform() {
    // MICA:
    // 2020 Jul 07 21:49:11.0 (UT1)
    // JD 2459038.409155
    // Saturn:
    // Astrometic Mean Equator and Equinox of J2000.0 (geoEqu2000)
    // RA 20:06:00.425, DEC -20:30:08.27, DIST 9.020653968
    // Apparent Geocentric True Equator and Equinox of Date (geoEquNow)
    // RA 20:07:12.460, DEC -20:26:31.68, DIST 9.020653968
    // Apparent Geocentric True Ecliptic and Equinox of Date (geoEclNow)
    // LON 299:35:26.6, DEC -0:12:45.3, DIST 9.020653968
    // Apparent Topocentric True Equator and Equinox of Date (topoEquNow) Hayden Planetarium
    // RA 20:07:12.495, DEC -20:26:32.06, DIST 9.020679768
    // Apparent Topocentric Local Zenith and True North (topoHorNow) Hayden Planetarium
    // ZA 127:17:23.1, AZ 85:34:36.4, DIST 9.020679768
    // Apparent Topocentric True Equator and Equinox of Date (hourAngle) Hayden Planetarium
    // LHA -8:08:39.51, DIST 9.020679768

    const clock = new U235AstroClock();
    const observatory = new U235AstroObservatory();
    const target = new U235AstroTarget();

    const utc = new Date(Date.UTC(2020, 6, 7, 21, 49, 11));
    clock.date$ = of(utc);
    clock.init();

    observatory.name$ = of('Hayden Planetarium');
    observatory.latitude$ = of(this.encode(40, 46, 53));
    observatory.longitude$ = of(-this.encode(73, 58, 26));
    observatory.connect(clock);
    observatory.init();

    target.name$ = of('Saturn');
    target.geoEqu2000$ = of({
      rightAscension: 20 + 6/60 + 0.425/3600,
      declination: -(20 + 30/60 + 8.27/3600),
      distance: 9.020653968
    });
    target.connect(observatory);
    target.init();

    target.geoEqu2000$.subscribe(value => {
      console.log('geoEqu2000', value);
    });

    target.geoEquNow$.subscribe(value => {
      console.log('geoEquNow', value);
    });

    target.geoEclNow$.subscribe(value => {
      console.log('geoEclNow', value);
    });

    target.topoEquNow$.subscribe(value => {
      console.log('topoEquNow', value);
    });

    target.topoHorNow$.subscribe(value => {
      console.log('topoHorNow', value);
    });

    target.hourAngle$.subscribe(value => {
      console.log('hourAngle', value);
    });


  }

  testSNR() {
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
    snrModel.fluxAttenuation$ = of(1);
    snrModel.binning$ = of(1);
    snrModel.exposure$ = of(90);
    snrModel.init();

    snrModel.signalToNoisePerSub$.subscribe(value => console.log(`signalToNoisePerSub: ${value}`));
    snrModel.targetElectronsPerSub$.subscribe(value => console.log(`targetElectronsPerSub: ${value}`));
  }

  testRoot1() {

    class SquareRoot implements U235AstroRootHelper {
      squareRootOf: number;
      constructor(squareRootOf: number) { this.squareRootOf = squareRootOf; }
      solveY(x: number): number {
        return x*x - this.squareRootOf;
      }
    }

    const squareRootOf = 2;
    const helper = new SquareRoot(squareRootOf);
    const maxIterations = 100;
    const xTolerance = 0.0001;
    const yTarget = 0;
    const xGuess1 = 1;
    const xGuess2 = 2;

    try {
      const answer = this.utility.bisectionMethod(maxIterations, xTolerance, yTarget, xGuess1, xGuess2, helper);
      console.log(`Square root of ${squareRootOf} is ${answer.xRoot.toFixed(3)} after ${answer.iterations} iterations.`);
    }
    catch(e) {
      console.error('Error', e.message);
    }

  }

  testRoot2() {

    class Helper implements U235AstroRootHelper {
      model: U235AstroSyncSNR;

      constructor(model: U235AstroSyncSNR) {
        this.model = model;
      }

      solveY(x: number): number {
        this.model.setNumberOfSubs(x);
        return this.model.getTotalSignalToNoiseOfStack();
      }
    }

    const model = new U235AstroSyncSNR();
    // William Optics ZenithStar 71:
    model.setAperture(71);
    model.setFocalLength(418);
    model.setCentralObstruction(0);
    model.setTotalReflectanceTransmittance(0.99);
    // Atik 314E:
    model.setPixelSize(4.65);
    model.setReadNoise(5.3);
    model.setDarkCurrent(0.1);
    model.setQuantumEfficiency(43);
    // Bortle 5:
    model.setSkyBrightness(20.02);
    // M81:
    model.setSurfaceBrightness(21.7);
    // Exposure:
    model.setFluxAttenuation(1);
    model.setBinning(1);
    model.setExposure(90);

    const helper = new Helper(model);

    const maxIterations = 100;
    const xTolerance = 0.001;
    const yTarget = 25;     // Target SNR
    const xGuess1 = 1;      // Number of subs bracket guess 1
    const xGuess2 = 40000;  // Number of subs bracket guess 2
    // Perhaps a good value of xGuess2 is to assume that no one will be willing to spend 1000 hours, so xGuess2 = 1000 * 3600 / exposure

    try {
      const answer = this.utility.bisectionMethod(maxIterations, xTolerance, yTarget, xGuess1, xGuess2, helper);
      console.log(`Solved after ${answer.iterations} iterations:`);
      console.log(`Total Integration Time of ${model.getTotalIntegrationTime().toFixed(2)} hours needed to achieve SNR ${model.getTotalSignalToNoiseOfStack().toFixed(1)}.`);
    }
    catch(e) {
      console.error('Error', e.message);
    }

  }

  testDate() {
    const date1 = new Date();
    const dayFrac = U235AstroClock.calculateDayFraction(date1);
    const jd0 = U235AstroClock.calculateJD0FromDate(date1);
    const jd = U235AstroClock.calculateJD(dayFrac, jd0);
    const date2 = U235AstroClock.calculateDate(jd);

    console.log('date1:', date1.toUTCString());
    console.log('jd:   ', jd);
    console.log('date2:', date2.toUTCString());
  }

}
