import { Component, OnInit } from '@angular/core';
import { U235AstroService } from 'u235-astro';
import { interval, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlashArg } from 'u235-astro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  rightAscension$: Observable<number[]>;
  rightAscensionChanged = new Subject<FlashArg>();
  declination$: Observable<number[]>;
  declinationChanged = new Subject<FlashArg>();
  altitude$: Observable<number[]>;
  altitudeChanged = new Subject<FlashArg>();
  azimuth$: Observable<number[]>;
  azimuthChanged = new Subject<FlashArg>();
  hourAngle$: Observable<number[]>;
  hourAngleChanged = new Subject<FlashArg>();
  latitude$: Observable<number[]>;
  latitudeChanged = new Subject<FlashArg>();
  longitude$: Observable<number[]>;
  longitudeChanged = new Subject<FlashArg>();

  constructor(private utility: U235AstroService) {}

  ngOnInit(): void {
    this.test2();
  }

  test1() {
    const exoDec = [1, 36, 37, 16, 600000];  // declination of HAT-P-5 b: +36d 37m 16.6s
    console.log(exoDec);
    const exoEnc = this.utility.encodeAngleToMath(exoDec);
    console.log(exoEnc);
    console.log(this.utility.decodeAngleFromMath(exoEnc));
  }

  test2() {
    this.altitude$ = interval(1000).pipe(map(value => this.utility.decodeAngleFromMath(90 - value / 60)));
    this.azimuth$ = interval(1667).pipe(map(value => this.utility.decodeAngleFromMath(180 + value / 60)));
    this.hourAngle$ = interval(1186).pipe(map(value => this.utility.decodeAngleFromMath((value / 4 - 15) / 15)));
    this.rightAscension$ = interval(1844).pipe(map(value => this.utility.decodeAngleFromMath((180 + value / 240) / 15)));
    this.declination$ = interval(1392).pipe(map(value => this.utility.decodeAngleFromMath(20 + value / 3600)));
    this.latitude$ = interval(1510).pipe(map(value => this.utility.decodeAngleFromMath(50 - value / 3600)));
    this.longitude$ = interval(1925).pipe(map(value => this.utility.decodeAngleFromMath(5 - value / 3600)));
  }

  onAltitudeChanged() {
    // this.altitudeChanged.next({});
    this.altitudeChanged.next({ backgroundColor: 'red' });
  }

  onAzimuthChanged() {
    // this.azimuthChanged.next({});
    this.azimuthChanged.next({ backgroundColor: 'green' });
  }

  onHourAngleChanged() {
    // this.hourAngleChanged.next({});
    this.hourAngleChanged.next({ backgroundColor: 'gold' });
  }

  onRightAscensionChanged() {
    // this.rightAscensionChanged.next({});
    this.rightAscensionChanged.next({ backgroundColor: 'orange' });
  }

  onDeclinationChanged() {
    // this.declinationChanged.next({});
    this.declinationChanged.next({ backgroundColor: 'blue' });
  }

  onLatitudeChanged() {
    // this.latitudeChanged.next({});
    this.latitudeChanged.next({ backgroundColor: 'brown' });
  }

  onLongitudeChanged() {
    // this.longitudeChanged.next({});
    this.longitudeChanged.next({ backgroundColor: 'pink' });
  }

}
