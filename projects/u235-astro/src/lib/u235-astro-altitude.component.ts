import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-altitude',
  template: `
    <span>
      {{plusminus}}{{degrees}}&deg; {{minutes}}'
    </span>
  `,
  styles: [
  ]
})
export class U235AstroAltitudeComponent implements OnInit, OnChanges {
  @Input() decodedAngle = [1, 0, 0, 0, 0];
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  degrees = '';
  minutes = '';
  plusminus = '';
  
  constructor() { }

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    let temp = '0' + this.decodedAngle[1].toFixed(0);
    const degrees = temp.slice(temp.length - 2);

    temp = '0' + this.decodedAngle[2].toFixed(0);
    const minutes = temp.slice(temp.length - 2);

    const plusminus = this.decodedAngle[0] > 0 ? '+' : '-';

    if (degrees !== this.degrees || minutes !== this.minutes || plusminus !== this.plusminus) {
      this.degrees = degrees;
      this.minutes = minutes;
      this.plusminus = plusminus;
      this.notifyChange.emit();
    }
  }

}
