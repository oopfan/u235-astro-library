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
  altitude$: Observable<number[]>;
  altitudeChanged = new Subject<FlashArg>();
  azimuth$: Observable<number[]>;
  azimuthChanged = new Subject<FlashArg>();

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
  }

  onAltitudeChanged() {
    // this.altitudeChanged.next({});
    this.altitudeChanged.next({ backgroundColor: 'red' });
  }

  onAzimuthChanged() {
    // this.azimuthChanged.next({});
    this.azimuthChanged.next({ backgroundColor: 'green' });
  }

}
