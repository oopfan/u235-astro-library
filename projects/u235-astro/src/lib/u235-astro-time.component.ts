import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'u235-astro-time',
  template: `
    <span>
      {{hour}}:{{minute}}:{{second}}
    </span>
  `,
  styles: [
  ]
})
export class U235AstroTimeComponent implements OnInit, OnChanges {
  @Input() hours: number;
  @Output() notifyChange:EventEmitter<void> = new EventEmitter();
  hour = '';
  minute = '';
  second = '';

  constructor() {}

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
    let remainder = Math.min(24, Math.max(0, this.hours));
    const h = Math.floor(remainder);
    remainder = (remainder - h) * 60;
    const m = Math.floor(remainder);
    remainder = (remainder - m) * 60;
    const s = Math.floor(remainder);

    let str = '0' + h.toFixed(0);
    const hour = str.substr(str.length - 2, 2);
    str = '0' + m.toFixed(0);
    const minute = str.substr(str.length - 2, 2);
    str = '0' + s.toFixed(0);
    const second = str.substr(str.length - 2, 2);

    if (hour !== this.hour || minute !== this.minute || second !== this.second) {
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.notifyChange.emit();
    }
  }

}
