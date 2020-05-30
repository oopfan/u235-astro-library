import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { U235AstroUtilityModule } from 'u235-astro-utility';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    U235AstroUtilityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
