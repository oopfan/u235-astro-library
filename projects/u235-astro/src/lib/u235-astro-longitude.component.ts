import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-longitude',
  template: `
    <span>
      {{degrees}}&deg; {{minutes}}' {{seconds}}{{microseconds}}" {{eastwest}}
    </span>
  `,
  styles: [
  ]
})
export class U235AstroLongitudeComponent implements OnInit, OnChanges {
  @Input() decodedAngle = [1, 0, 0, 0, 0];
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  degrees = '';
  minutes = '';
  seconds = '';
  microseconds = '';
  eastwest = '';

  constructor() {}

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    const degrees = this.decodedAngle[1].toFixed(0);

    let temp = '0' + this.decodedAngle[2].toFixed(0);
    const minutes = temp.slice(temp.length - 2);

    temp = '0' + this.decodedAngle[3].toFixed(0);
    const seconds = temp.slice(temp.length - 2);

    const eastwest = this.decodedAngle[0] > 0 ? 'E' : 'W';

    if (degrees !== this.degrees || minutes !== this.minutes || seconds !== this.seconds || eastwest !== this.eastwest) {
      this.degrees = degrees;
      this.minutes = minutes;
      this.seconds = seconds;
      this.eastwest = eastwest;
      this.notifyChange.emit();
    }
  }

}
