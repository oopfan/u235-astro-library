import { Component, OnInit } from '@angular/core';
import { U235AstroService } from 'u235-astro';
import { interval, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  altitude$: Observable<number[]>;
  altitudeChanged = new Subject<any>();
  altitudeChangedCount = 0;

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
    this.altitude$ = interval(1000).pipe(map(value => this.utility.decodeAngleFromMath(value / 60 - 5)));
  }

  onAltitudeChanged() {
    this.altitudeChanged.next(++this.altitudeChangedCount);
    // this.altitudeChanged.next({ watch: ++this.altitudeChangedCount, backgroundColor: 'red' });
  }

}
