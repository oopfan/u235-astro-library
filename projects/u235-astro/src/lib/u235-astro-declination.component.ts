import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { U235AstroService } from './u235-astro.service';

@Component({
  selector: 'u235-astro-declination',
  template: `
    <span>
      {{plusminus}}{{degree}}&deg;&nbsp;{{minute}}'&nbsp;{{second}}"
    </span>
  `,
  styles: [
  ]
})
export class U235AstroDeclinationComponent implements OnInit, OnChanges {
  @Input() degrees: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  plusminus = '';
  degree = '';
  minute = '';
  second = '';
  
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
    const deg = Math.min(90, Math.max(-90, this.degrees));
    const decoded = this.utility.decodeAngleFromMath(deg);

    const plusminus = decoded[0] > 0 ? '+' : '-';

    let str = '0' + decoded[1].toFixed(0);
    const degree = str.slice(str.length - 2);

    str = '0' + decoded[2].toFixed(0);
    const minute = str.slice(str.length - 2);

    str = '0' + decoded[3].toFixed(0);
    const second = str.slice(str.length - 2);

    if (plusminus !== this.plusminus || degree !== this.degree || minute !== this.minute || second !== this.second) {
      this.degree = degree;
      this.minute = minute;
      this.second = second;
      this.plusminus = plusminus;
      this.notifyChange.emit();
    }
  }

}
