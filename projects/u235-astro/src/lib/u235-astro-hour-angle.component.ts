import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { U235AstroService } from './u235-astro.service';

@Component({
  selector: 'u235-astro-hour-angle',
  template: `
    <span>
      {{hour}}<sup>h</sup>&nbsp;{{minute}}<sup>m</sup>&nbsp;{{eastwest}}
    </span>
  `,
  styles: [
  ]
})
export class U235AstroHourAngleComponent implements OnInit, OnChanges {
  @Input() hours: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  hour = '';
  minute = '';
  eastwest = '';

  constructor(private utility: U235AstroService) { }

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    if (isNaN(this.hours)) {
      return;
    }
    const hr = Math.min(12, Math.max(-12, this.hours));
    const decoded = this.utility.decodeAngleFromMath(hr);

    let str = '0' + decoded[1].toFixed(0);
    const hour = str.slice(str.length - 2);

    str = '0' + decoded[2].toFixed(0);
    const minute = str.slice(str.length - 2);

    const eastwest = decoded[0] > 0 ? 'W' : 'E';

    if (hour !== this.hour || minute !== this.minute || eastwest !== this.eastwest) {
      this.hour = hour;
      this.minute = minute;
      this.eastwest = eastwest;
      this.notifyChange.emit();
    }
  }

}
