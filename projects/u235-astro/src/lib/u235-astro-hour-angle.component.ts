import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-hour-angle',
  template: `
    <span>
      {{hours}}<sup>h</sup> {{minutes}}<sup>m</sup> {{eastwest}}
    </span>
  `,
  styles: [
  ]
})
export class U235AstroHourAngleComponent implements OnInit, OnChanges {
  @Input() decodedAngle = [1, 0, 0, 0, 0];
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  hours = '';
  minutes = '';
  eastwest = '';

  constructor() { }

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    let temp = '0' + this.decodedAngle[1].toFixed(0);
    const hours = temp.slice(temp.length - 2);

    temp = '0' + this.decodedAngle[2].toFixed(0);
    const minutes = temp.slice(temp.length - 2);

    const eastwest = this.decodedAngle[0] > 0 ? 'W' : 'E';

    if (hours !== this.hours || minutes !== this.minutes) {
      this.hours = hours;
      this.minutes = minutes;
      this.eastwest = eastwest;
      this.notifyChange.emit();
    }
  }

}