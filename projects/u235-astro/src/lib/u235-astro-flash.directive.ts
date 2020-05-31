import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
  selector: '[u235-astro-flash]'
})
export class U235AstroFlashDirective implements OnInit {
  @Input('u235-astro-flash') config: Observable<any>;
  timerId = 0;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.element.nativeElement.style.transitionProperty = 'background-color';
    this.element.nativeElement.style.transitionTimingFunction = 'ease-out';

    this.config.subscribe(value => {
      this.element.nativeElement.style.transitionDuration = '0s';
      this.element.nativeElement.style.backgroundColor = value.backgroundColor || '#70b5ff';

      window.clearTimeout(this.timerId);
      this.timerId = window.setTimeout(() => {
        this.element.nativeElement.style.transitionDuration = value.transitionDuration || '0.4s';
        this.element.nativeElement.style.backgroundColor = 'transparent';
      }, 50);
    });
  }

}
