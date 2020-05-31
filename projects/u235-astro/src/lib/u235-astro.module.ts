import { NgModule } from '@angular/core';
import { U235AstroAltitudeComponent } from './u235-astro-altitude.component';
import { U235AstroAzimuthComponent } from './u235-astro-azimuth.component';
import { U235AstroRightAscensionComponent } from './u235-astro-right-ascension.component';
import { U235AstroDeclinationComponent } from './u235-astro-declination.component';
import { U235AstroFlashDirective } from './u235-astro-flash.directive';

@NgModule({
  declarations: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroRightAscensionComponent,
    U235AstroDeclinationComponent,
    U235AstroFlashDirective
  ],
  imports: [
  ],
  exports: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroRightAscensionComponent,
    U235AstroDeclinationComponent,
    U235AstroFlashDirective
  ]
})
export class U235AstroModule { }
