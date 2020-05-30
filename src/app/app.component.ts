import { Component } from '@angular/core';
import { U235AstroUtilityService } from 'u235-astro-utility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private utility: U235AstroUtilityService) {
    utility.greetings();
  }
}
