import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[u235-astro-flash]'
})
export class U235AstroFlashDirective implements OnChanges {
  @Input('u235-astro-flash') config: any;
  timerId = 0;

  constructor(private element: ElementRef) {
    this.element.nativeElement.style.transitionProperty = 'background-color';
    this.element.nativeElement.style.transitionTimingFunction = 'ease-out';
  }

  ngOnChanges() {
    this.element.nativeElement.style.transitionDuration = '0s';
    this.element.nativeElement.style.backgroundColor = this.config.backgroundColor || '#70b5ff';
    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => {
      this.element.nativeElement.style.transitionDuration = this.config.transitionDuration || '0.4s';
      this.element.nativeElement.style.backgroundColor = 'transparent';
    }, 50);
  }

}
