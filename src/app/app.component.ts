import { Component, OnInit } from '@angular/core';
import { interval, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { U235AstroFlashArg, U235AstroClock, U235AstroObservatory, U235AstroTarget, U235AstroSNR } from 'u235-astro';

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
    {
      name: 'Vega',
      ra2000: this.encode(18, 36, 56),
      de2000: this.encode(38, 47, 1)
    },
    {
      name: 'M13',
      ra2000: this.encode(16, 41, 42),
      de2000: this.encode(36, 27, 39)
    },
    {
      name: 'M27',
      ra2000: this.encode(19, 59, 36),
      de2000: this.encode(22, 43, 18)
    },
    {
      name: 'M57',
      ra2000: this.encode(18, 53, 35),
      de2000: this.encode(33, 1, 47)
    }
  ]

  clock = new U235AstroClock();
  observatories: U235AstroObservatory[] = [];
  targets: MyTarget[][] = [];

  constructor() {}

  ngOnInit(): void {
    this.testSNR();

    this.clock.date$ = interval(1000).pipe(map(() => new Date()));
    this.clock.init();

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
        target.equ2000$ = of({
          rightAscension: object.ra2000,
          declination: object.de2000
        });
        target.connect(observatory);
        target.init();
        targets.push(target);
      }

      this.targets.push(targets);
    }
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
    snrModel.fluxAttenuation$ = of(1);  // assume zenith and unity relative QE
    snrModel.binning$ = of(1);
    snrModel.exposure$ = of(90);
    snrModel.init();

    snrModel.signalToNoisePerSub$.subscribe(value => console.log(`SNR per sub: ${value}`));
    // Output:
    // SNR per sub: 1.3354560781189644
}

}
