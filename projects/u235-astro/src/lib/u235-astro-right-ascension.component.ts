import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-right-ascension',
  template: `
    <span>
      {{hours}}<sup>h</sup> {{minutes}}<sup>m</sup> {{seconds}}<sup>s</sup>
    </span>
  `,
  styles: [
  ]
})
export class U235AstroRightAscensionComponent implements OnInit, OnChanges {
  @Input() decodedAngle = [1, 0, 0, 0, 0];
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  hours = '';
  minutes = '';
  seconds = '';

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

    temp = '0' + this.decodedAngle[3].toFixed(0);
    const seconds = temp.slice(temp.length - 2);

    if (hours !== this.hours || minutes !== this.minutes || seconds !== this.seconds) {
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.notifyChange.emit();
    }
  }
}
