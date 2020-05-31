import { NgModule } from '@angular/core';
import { U235AstroAltitudeComponent } from './u235-astro-altitude.component';
import { U235AstroAzimuthComponent } from './u235-astro-azimuth.component';
import { U235AstroFlashDirective } from './u235-astro-flash.directive';

@NgModule({
  declarations: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroFlashDirective
  ],
  imports: [
  ],
  exports: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroFlashDirective
  ]
})
export class U235AstroModule { }
