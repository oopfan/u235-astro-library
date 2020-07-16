import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { U235AstroService } from './u235-astro.service';

@Component({
  selector: 'u235-astro-azimuth',
  template: `
    <span>
      +{{degree}}&deg;&nbsp;{{minute}}'
    </span>
  `,
  styles: [
  ]
})
export class U235AstroAzimuthComponent implements OnInit, OnChanges {
  @Input() degrees: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  degree = '';
  minute = '';

  constructor(private utility: U235AstroService) {}

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    if (isNaN(this.degrees)) {
      return;
    }
    const deg = Math.min(360, Math.max(0, this.degrees));
    const decoded = this.utility.decodeAngleFromMath(deg);

    let str: string;
    let degree: string;

    if (decoded[1] < 100) {
      str = '0' + decoded[1].toFixed(0);
      degree = str.slice(str.length - 2);
    }
    else {
      str = decoded[1].toFixed(0);
      degree = str;
    }

    str = '0' + decoded[2].toFixed(0);
    const minute = str.slice(str.length - 2);

    if (degree !== this.degree || minute !== this.minute) {
      this.degree = degree;
      this.minute = minute;
      this.notifyChange.emit();
    }
  }

}
