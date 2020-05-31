import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-declination',
  template: `
    <span>
      {{plusminus}}{{degrees}}&deg; {{minutes}}' {{seconds}}"
    </span>
  `,
  styles: [
  ]
})
export class U235AstroDeclinationComponent implements OnInit, OnChanges {
  @Input() decodedAngle = [1, 0, 0, 0, 0];
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  degrees = '';
  minutes = '';
  seconds = '';
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

    temp = '0' + this.decodedAngle[3].toFixed(0);
    const seconds = temp.slice(temp.length - 2);

    const plusminus = this.decodedAngle[0] > 0 ? '+' : '-';

    if (degrees !== this.degrees || minutes !== this.minutes || seconds !== this.seconds || plusminus !== this.plusminus) {
      this.degrees = degrees;
      this.minutes = minutes;
      this.seconds = seconds;
      this.plusminus = plusminus;
      this.notifyChange.emit();
    }
  }

}
