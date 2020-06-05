import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { U235AstroService } from './u235-astro.service';

@Component({
  selector: 'u235-astro-right-ascension',
  template: `
    <span>
      {{hour}}<sup>h</sup> {{minute}}<sup>m</sup> {{second}}<sup>s</sup>
    </span>
  `,
  styles: [
  ]
})
export class U235AstroRightAscensionComponent implements OnInit, OnChanges {
  @Input() hours: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  hour = '';
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
    if (isNaN(this.hours)) {
      return;
    }
    const hr = Math.min(24, Math.max(0, this.hours));
    const decoded = this.utility.decodeAngleFromMath(hr);

    let str = '0' + decoded[1].toFixed(0);
    const hour = str.slice(str.length - 2);

    str = '0' + decoded[2].toFixed(0);
    const minute = str.slice(str.length - 2);

    str = '0' + decoded[3].toFixed(0);
    const second = str.slice(str.length - 2);

    if (hour !== this.hour || minute !== this.minute || second !== this.second) {
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.notifyChange.emit();
    }
  }

}
