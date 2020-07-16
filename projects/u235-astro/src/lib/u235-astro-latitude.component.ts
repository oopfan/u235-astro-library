import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { U235AstroService } from './u235-astro.service';

@Component({
  selector: 'u235-astro-latitude',
  template: `
    <span>
      {{degree}}&deg;&nbsp;{{minute}}'&nbsp;{{second}}"&nbsp;{{northsouth}}
    </span>
  `,
  styles: [
  ]
})
export class U235AstroLatitudeComponent implements OnInit, OnChanges {
  @Input() degrees: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  degree = '';
  minute = '';
  second = '';
  northsouth = '';

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

    const degree = decoded[1].toFixed(0);

    let str = '0' + decoded[2].toFixed(0);
    const minute = str.slice(str.length - 2);

    str = '0' + decoded[3].toFixed(0);
    const second = str.slice(str.length - 2);

    const northsouth = decoded[0] > 0 ? 'N' : 'S';

    if (degree !== this.degree || minute !== this.minute || second !== this.second || northsouth !== this.northsouth) {
      this.degree = degree;
      this.minute = minute;
      this.second = second;
      this.northsouth = northsouth;
      this.notifyChange.emit();
    }
  }

}
