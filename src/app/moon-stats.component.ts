import { Component, OnInit } from "@angular/core";
import { Observable, interval, of, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { U235AstroClock, U235AstroReactiveSolarSystem, U235AstroReactiveSchlyterMoon, U235AstroObservatory, U235AstroTarget, U235AstroVector3D, U235AstroMatrix3D } from 'u235-astro';

interface MoonStats {
    phasePct: number;
    illuminationPct: number;
}
  
  @Component({
    selector: 'app-moon-stats',
    templateUrl: './moon-stats.component.html',
    styleUrls: [ './moon-stats.component.css' ]
})
export class MoonStatsComponent implements OnInit {

    moonStats$: Observable<MoonStats>;

    private moonPhase = [
        {phasePct: 1, phaseStr: 'Full Moon'},
        {phasePct: 0.55, phaseStr: 'Waxing Gibbous'},
        {phasePct: 0.5, phaseStr: 'First Quarter'},
        {phasePct: 0.05, phaseStr: 'Waxing Crescent'},
        {phasePct: 0, phaseStr: 'New Moon'},
        {phasePct: -0.45, phaseStr: 'Waning Crescent'},
        {phasePct: -0.5, phaseStr: 'Last Quarter'},
        {phasePct: -0.95, phaseStr: 'Waning Gibbous'}
    ];
    
    getMoonPhase = (phasePct: number): string => {
        for (var i = 0, n = this.moonPhase.length; i < n; i++) {
            if (phasePct >= this.moonPhase[i].phasePct) {
                return this.moonPhase[i].phaseStr;
            }
        }
        return this.moonPhase[0].phaseStr;
    }
    
    getMoonPath = (phasePct: number, illuminationPct: number): string => {
        let pct = Math.sign(phasePct) * illuminationPct;
        pct = pct < -1 ? -1 : (pct >= 1 ? -1 : pct);
        const columnL = pct < 0 ? 1 : (pct >= 1 ? 1 : 0);
        const columnP = pct < -0.5 ? 50 : (pct > 0.5 ? 50 : 100 * (0.5 - Math.abs(pct)));
        const columnQ = pct < -0.5 ? 100 * (-0.5 - pct) : (pct > 0.5 ? 100 * (pct - 0.5) : 50);
        const columnR = pct < -0.5 ? 270 : (pct > 0.5 ? 270 : 0);
        const columnT = pct < -0.5 ? 1 : (pct > 0.5 ? 0 : (pct < 0 ? 0 : 1));
        const d = `M 50 100 A 50 50 0 0 ${ columnL } 50 0 A ${ columnP } ${ columnQ } ${ columnR } 0 ${ columnT } 50 100`;
        return d;
    }
    
    ngOnInit(): void {

        const clock = new U235AstroClock();
        const solarSystem = new U235AstroReactiveSolarSystem();
        const moon = new U235AstroReactiveSchlyterMoon();
        const observatory = new U235AstroObservatory();
        const targetSun = new U235AstroTarget();
        const targetMoon = new U235AstroTarget();
    
        clock.date$ = interval(60000).pipe(startWith(0), map(() => { return new Date(); }));
        clock.init();
    
        solarSystem.connect(clock);
        solarSystem.init();
    
        moon.connect(clock);
        moon.init();
    
        observatory.latitude$ = of(0);
        observatory.longitude$ = of(0);
        observatory.connect(clock);
        observatory.init();
    
        targetMoon.geoEqu2000$ = moon.geoEqu2000$;
        targetMoon.connect(observatory);
        targetMoon.init();
    
        targetSun.geoEqu2000$ = solarSystem.sunGeoEqu2000$;
        targetSun.connect(observatory);
        targetSun.init();
    
        this.moonStats$ = combineLatest(
            targetMoon.geoEcl2000$,
            targetSun.geoEcl2000$
        ).pipe(
            map(([moon, sun]) => {
                const moonVec = new U235AstroVector3D();
                moonVec.setPolar(moon.longitude / 180 * Math.PI, moon.latitude / 180 * Math.PI, moon.distance);
                const sunVec = new U235AstroVector3D();
                sunVec.setPolar(sun.longitude / 180 * Math.PI, sun.latitude / 180 * Math.PI, sun.distance);
        
                const angle = moonVec.getAngularSeparation(sunVec);
                let illuminationPct = (1 - Math.cos(angle)) * 0.5;
                illuminationPct = Math.max(Math.min(illuminationPct, 1), 0);
        
                const rot = new U235AstroMatrix3D();
                rot.setRotateZ(moon.longitude / 180 * Math.PI);
                sunVec.matrixMultiply(rot);
                const result = sunVec.getPolar();
                let phasePct = -result[0] / Math.PI;
                phasePct = Math.max(Math.min(phasePct, 1), -1);
        
                return { phasePct, illuminationPct };
            })
        );

    }
}
