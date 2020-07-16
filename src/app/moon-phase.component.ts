import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Observable, interval, of, combineLatest, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { U235AstroClock, U235AstroReactiveSolarSystem, U235AstroReactiveSchlyterMoon, U235AstroObservatory, U235AstroTarget, U235AstroVector3D, U235AstroMatrix3D } from 'u235-astro';

interface MoonStats {
    date: Date;
    phaseName: string;
    phasePct: number;
    illuminationPct: number;
}

@Component({
    selector: 'app-moon-phase',
    templateUrl: './moon-phase.component.html',
    styleUrls: [ './moon-phase.component.css' ]
})
export class MoonPhaseComponent implements OnInit, OnDestroy {
    @Input() dateInit: Date;
    @Input() dateOffset: number = 0;
    @Input() width = 100;
    @Output() notifyMoonStats:EventEmitter<MoonStats> = new EventEmitter();
    moonStatsSubscription: Subscription;

    moonStats$: Observable<MoonStats>;

    static instanceId = 0;
    pathId = '';
    clipId = '';

    private moonPhase = [
        {phasePct: 0.975, phaseStr: 'Full Moon'},
        {phasePct: 0.575, phaseStr: 'Waxing Gibbous'},
        {phasePct: 0.525, phaseStr: 'First Quarter'},
        {phasePct: 0.025, phaseStr: 'Waxing Crescent'},
        {phasePct: -0.025, phaseStr: 'New Moon'},
        {phasePct: -0.475, phaseStr: 'Waning Crescent'},
        {phasePct: -0.525, phaseStr: 'Last Quarter'},
        {phasePct: -0.975, phaseStr: 'Waning Gibbous'}
    ];
    
    private getPhaseName = (phasePct: number): string => {
        for (var i = 0, n = this.moonPhase.length; i < n; i++) {
            if (phasePct >= this.moonPhase[i].phasePct) {
                return this.moonPhase[i].phaseStr;
            }
        }
        return this.moonPhase[0].phaseStr;
    }
    
    getPhasePath = (phasePct: number, illuminationPct: number): string => {
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
        MoonPhaseComponent.instanceId++;
        this.pathId = "u235-astro-moon-phase-path" + MoonPhaseComponent.instanceId;
        this.clipId = "u235-astro-moon-phase-clip" + MoonPhaseComponent.instanceId;
    
    
        const clock = new U235AstroClock();
        const solarSystem = new U235AstroReactiveSolarSystem();
        const moon = new U235AstroReactiveSchlyterMoon();
        const observatory = new U235AstroObservatory();
        const targetSun = new U235AstroTarget();
        const targetMoon = new U235AstroTarget();
    
        if (this.dateInit) {
            clock.date$ = of(new Date(this.dateInit.getTime() + this.dateOffset));
        }
        else {
            clock.date$ = interval(60000).pipe(startWith(0), map(() => { return new Date(Date.now() + this.dateOffset); }));
        }
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
            clock.date$,
            targetMoon.geoEcl2000$,
            targetSun.geoEcl2000$
        ).pipe(
            map(([date, moon, sun]) => {
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

                const phaseName = this.getPhaseName(phasePct);
                return { date, phaseName, phasePct, illuminationPct };
            })
        );

        this.moonStatsSubscription = this.moonStats$.subscribe(value => {
            this.notifyMoonStats.emit(value);
        });

    }

    ngOnDestroy(): void {
        if (this.moonStatsSubscription) {
            this.moonStatsSubscription.unsubscribe();
        }
    }

}
