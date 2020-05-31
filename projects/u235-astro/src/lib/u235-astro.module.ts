import { NgModule } from '@angular/core';
import { U235AstroAltitudeComponent } from './u235-astro-altitude.component';
import { U235AstroAzimuthComponent } from './u235-astro-azimuth.component';
import { U235AstroRightAscensionComponent } from './u235-astro-right-ascension.component';
import { U235AstroDeclinationComponent } from './u235-astro-declination.component';
import { U235AstroLatitudeComponent } from './u235-astro-latitude.component';
import { U235AstroLongitudeComponent } from './u235-astro-longitude.component';
import { U235AstroHourAngleComponent } from './u235-astro-hour-angle.component';
import { U235AstroFlashDirective } from './u235-astro-flash.directive';

@NgModule({
  declarations: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroRightAscensionComponent,
    U235AstroDeclinationComponent,
    U235AstroLatitudeComponent,
    U235AstroLongitudeComponent,
    U235AstroHourAngleComponent,
    U235AstroFlashDirective
  ],
  imports: [
  ],
  exports: [
    U235AstroAltitudeComponent,
    U235AstroAzimuthComponent,
    U235AstroRightAscensionComponent,
    U235AstroDeclinationComponent,
    U235AstroLatitudeComponent,
    U235AstroLongitudeComponent,
    U235AstroHourAngleComponent,
    U235AstroFlashDirective
  ]
})
export class U235AstroModule { }
