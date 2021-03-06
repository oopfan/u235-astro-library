import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { U235AstroModule } from 'u235-astro';

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    U235AstroModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
