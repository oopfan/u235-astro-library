import { Observable, combineLatest, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export class U235AstroSyncSNR {

    // Functions to share with the reactive version:
    static calculateElectronsPerSecond(clearApertureEquivalent: number, fluxAttenuation: number, brightness: number, pixelSurface: number, quantumEfficiency: number): number {
        const mag0flux = 879000;
        return clearApertureEquivalent * mag0flux * fluxAttenuation / Math.pow(10, 0.4 * brightness) * pixelSurface * quantumEfficiency / 100;
    }
    static calculateElectronsPerSub(electronsPerSecond: number, exposure: number): number {
        return electronsPerSecond * exposure;
    }
    static calculateClearApertureEquivalent(aperture: number, centralObstruction: number, totalReflectanceTransmittance: number): number {
        return (aperture * aperture - centralObstruction * centralObstruction) * totalReflectanceTransmittance * Math.PI / 400;
    }
    static calculateImageResolution(pixelSize: number, binning: number, focalLength: number): number {
        return 206.3 * pixelSize * binning / focalLength;
    }
    static calculatePixelSurface(imageResolution: number): number {
        return imageResolution * imageResolution;
    }
    static calculateNoisePerSub(electronsPerSub: number): number {
        return Math.sqrt(electronsPerSub);
    }
    static calculateTotalNoisePerSub(readNoise: number, shotNoise: number, skyNoise: number, darkNoise: number): number {
        return Math.sqrt(readNoise * readNoise + shotNoise * shotNoise + skyNoise * skyNoise + darkNoise * darkNoise);
    }
    static calculateSignalToNoisePerSub(targetElectronsPerSub: number, totalNoisePerSub: number): number {
        return targetElectronsPerSub / totalNoisePerSub;
    }
    static calculateTotalIntegrationTime(exposure: number, numberOfSubs: number): number {
        return exposure * numberOfSubs / 3600;
    }
    static calculateTotalSignalToNoiseOfStack(signalToNoisePerSub: number, numberOfSubs: number): number {
        return signalToNoisePerSub * Math.sqrt(numberOfSubs);
    }

    // Implementation:
    private fluxAttenuation: number = Number.NaN;
    private aperture: number = Number.NaN;
    private focalLength: number = Number.NaN;
    private centralObstruction: number = Number.NaN;
    private totalReflectanceTransmittance: number = Number.NaN;
    private pixelSize: number = Number.NaN;
    private binning: number = Number.NaN;
    private surfaceBrightness: number = Number.NaN;
    private readNoise: number = Number.NaN;
    private darkCurrent: number = Number.NaN;
    private quantumEfficiency: number = Number.NaN;
    private skyBrightness: number = Number.NaN;
    private exposure: number = Number.NaN;
    private numberOfSubs: number = Number.NaN;
    private clearApertureEquivalent = Number.NaN;
    private imageResolution = Number.NaN;
    private pixelSurface = Number.NaN;
    private targetElectronsPerSecond = Number.NaN;
    private targetElectronsPerSub = Number.NaN;
    private shotNoise = Number.NaN;
    private skyElectronsPerSecond = Number.NaN;
    private skyElectronsPerSub = Number.NaN;
    private skyNoise = Number.NaN;
    private darkSignalPerSub = Number.NaN;
    private darkNoise = Number.NaN;
    private totalNoisePerSub = Number.NaN;
    private signalToNoisePerSub = Number.NaN;
    private totalIntegrationTime = Number.NaN;
    private totalSignalToNoiseOfStack = Number.NaN;

    private updateClearApertureEquivalent() {
        this.clearApertureEquivalent = U235AstroSyncSNR.calculateClearApertureEquivalent(this.aperture, this.centralObstruction, this.totalReflectanceTransmittance);
    }
    private updateImageResolution() {
        this.imageResolution = U235AstroSyncSNR.calculateImageResolution(this.pixelSize, this.binning, this.focalLength);
    }
    private updatePixelSurface() {
        this.pixelSurface = U235AstroSyncSNR.calculatePixelSurface(this.imageResolution);
    }
    private updateTargetElectronsPerSecond() {
        this.targetElectronsPerSecond = U235AstroSyncSNR.calculateElectronsPerSecond(this.clearApertureEquivalent, this.fluxAttenuation, this.surfaceBrightness, this.pixelSurface, this.quantumEfficiency);
    }
    private updateTargetElectronsPerSub() {
        this.targetElectronsPerSub = U235AstroSyncSNR.calculateElectronsPerSub(this.targetElectronsPerSecond, this.exposure);
    }
    private updateShotNoise() {
        this.shotNoise = U235AstroSyncSNR.calculateNoisePerSub(this.targetElectronsPerSub);
    }
    private updateSkyElectronsPerSecond() {
        this.skyElectronsPerSecond = U235AstroSyncSNR.calculateElectronsPerSecond(this.clearApertureEquivalent, this.fluxAttenuation, this.skyBrightness, this.pixelSurface, this.quantumEfficiency);
    }
    private updateSkyElectronsPerSub() {
        this.skyElectronsPerSub = U235AstroSyncSNR.calculateElectronsPerSub(this.skyElectronsPerSecond, this.exposure);
    }
    private updateSkyNoise() {
        this.skyNoise = U235AstroSyncSNR.calculateNoisePerSub(this.skyElectronsPerSub);
    }
    private updateDarkSignalPerSub() {
        this.darkSignalPerSub = U235AstroSyncSNR.calculateElectronsPerSub(this.darkCurrent, this.exposure);
    }
    private updateDarkNoise() {
        this.darkNoise = U235AstroSyncSNR.calculateNoisePerSub(this.darkSignalPerSub);
    }
    private updateTotalNoisePerSub() {
        this.totalNoisePerSub = U235AstroSyncSNR.calculateTotalNoisePerSub(this.readNoise, this.shotNoise, this.skyNoise, this.darkNoise);
    }
    private updateSignalToNoisePerSub() {
        this.signalToNoisePerSub = U235AstroSyncSNR.calculateSignalToNoisePerSub(this.targetElectronsPerSub, this.totalNoisePerSub);
    }
    private updateTotalIntegrationTime() {
        this.totalIntegrationTime = U235AstroSyncSNR.calculateTotalIntegrationTime(this.exposure, this.numberOfSubs);
    }
    private updateTotalSignalToNoiseOfStack() {
        this.totalSignalToNoiseOfStack = U235AstroSyncSNR.calculateTotalSignalToNoiseOfStack(this.signalToNoisePerSub, this.numberOfSubs);
    }

    // Sets:
    setFluxAttenuation(value: number): void {
        this.fluxAttenuation = value;
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setAperture(value: number): void {
        this.aperture = value;
        this.updateClearApertureEquivalent();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setFocalLength(value: number): void {
        this.focalLength = value;
        this.updateImageResolution();
        this.updatePixelSurface();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setCentralObstruction(value: number): void {
        this.centralObstruction = value;
        this.updateClearApertureEquivalent();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setTotalReflectanceTransmittance(value: number): void {
        this.totalReflectanceTransmittance = value;
        this.updateClearApertureEquivalent();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setPixelSize(value: number): void {
        this.pixelSize = value;
        this.updateImageResolution();
        this.updatePixelSurface();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setBinning(value: number): void {
        this.binning = value;
        this.updateImageResolution();
        this.updatePixelSurface();
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setSurfaceBrightness(value: number): void {
        this.surfaceBrightness = value;
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setReadNoise(value: number): void {
        this.readNoise = value;
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setDarkCurrent(value: number): void {
        this.darkCurrent = value;
        this.updateDarkSignalPerSub();
        this.updateDarkNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setQuantumEfficiency(value: number): void {
        this.quantumEfficiency = value;
        this.updateTargetElectronsPerSecond();
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setSkyBrightness(value: number): void {
        this.skyBrightness = value;
        this.updateSkyElectronsPerSecond();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
    }
    setExposure(value: number): void {
        this.exposure = value;
        this.updateTargetElectronsPerSub();
        this.updateShotNoise();
        this.updateSkyElectronsPerSub();
        this.updateSkyNoise();
        this.updateDarkSignalPerSub();
        this.updateDarkNoise();
        this.updateTotalNoisePerSub();
        this.updateSignalToNoisePerSub();
        this.updateTotalSignalToNoiseOfStack();
        this.updateTotalIntegrationTime();
    }
    setNumberOfSubs(value: number): void {
        this.numberOfSubs = value;
        this.updateTotalSignalToNoiseOfStack();
        this.updateTotalIntegrationTime();
    }

    // Gets:
    getFluxAttenuation(): number {
        return this.fluxAttenuation;
    }
    getAperture(): number {
        return this.aperture;
    }
    getFocalLength(): number {
        return this.focalLength;
    }
    getCentralObstruction(): number {
        return this.centralObstruction;
    }
    getTotalReflectanceTransmittance(): number {
        return this.totalReflectanceTransmittance;
    }
    getPixelSize(): number {
        return this.pixelSize;
    }
    getBinning(): number {
        return this.binning;
    }
    getSurfaceBrightness(): number {
        return this.surfaceBrightness;
    }
    getReadNoise(): number {
        return this.readNoise;
    }
    getDarkCurrent(): number {
        return this.darkCurrent;
    }
    getQuantumEfficiency(): number {
        return this.quantumEfficiency;
    }
    getSkyBrightness(): number {
        return this.skyBrightness;
    }
    getExposure(): number {
        return this.exposure;
    }
    getNumberOfSubs(): number {
        return this.numberOfSubs;
    }
    getClearApertureEquivalent(): number {
        return this.clearApertureEquivalent;
    }
    getImageResolution(): number {
        return this.imageResolution;
    }
    getPixelSurface(): number {
        return this.pixelSurface;
    }
    getTargetElectronsPerSecond(): number {
        return this.targetElectronsPerSecond;
    }
    getTargetElectronsPerSub(): number {
        return this.targetElectronsPerSub;
    }
    getShotNoise(): number {
        return this.shotNoise;
    }
    getSkyElectronsPerSecond(): number {
        return this.skyElectronsPerSecond;
    }
    getSkyElectronsPerSub(): number {
        return this.skyElectronsPerSub;
    }
    getSkyNoise(): number {
        return this.skyNoise;
    }
    getDarkSignalPerSub(): number {
        return this.darkSignalPerSub;
    }
    getDarkNoise(): number {
        return this.darkNoise;
    }
    getTotalNoisePerSub(): number {
        return this.totalNoisePerSub;
    }
    getSignalToNoisePerSub(): number {
        return this.signalToNoisePerSub;
    }
    getTotalSignalToNoiseOfStack(): number {
        return this.totalSignalToNoiseOfStack;
    }
    getTotalIntegrationTime(): number {
        return this.totalIntegrationTime;
    }

}

export class U235AstroSNR {
    // Inputs:
    fluxAttenuation$: Observable<number>;
    aperture$: Observable<number>;
    focalLength$: Observable<number>;
    centralObstruction$: Observable<number>;
    totalReflectanceTransmittance$: Observable<number>;
    pixelSize$: Observable<number>;
    binning$: Observable<number>;
    surfaceBrightness$: Observable<number>;
    readNoise$: Observable<number>;
    darkCurrent$: Observable<number>;
    quantumEfficiency$: Observable<number>;
    skyBrightness$: Observable<number>;
    exposure$: Observable<number>;
    numberOfSubs$: Observable<number>;

    // Outputs:
    clearApertureEquivalent$: Observable<number>;
    imageResolution$: Observable<number>;
    pixelSurface$: Observable<number>;
    targetElectronsPerSecond$: Observable<number>;
    targetElectronsPerSub$: Observable<number>;
    shotNoise$: Observable<number>;
    skyElectronsPerSecond$: Observable<number>;
    skyElectronsPerSub$: Observable<number>;
    skyNoise$: Observable<number>;
    darkSignalPerSub$: Observable<number>;
    darkNoise$: Observable<number>;
    totalNoisePerSub$: Observable<number>;
    signalToNoisePerSub$: Observable<number>;
    totalSignalToNoiseOfStack$: Observable<number>;
    totalIntegrationTime$: Observable<number>;

    constructor() {
        const message = 'Please call init() before subscribing to outputs';
        this.clearApertureEquivalent$ = throwError(new Error(message));
        this.imageResolution$ = throwError(new Error(message));
        this.pixelSurface$ = throwError(new Error(message));
        this.targetElectronsPerSecond$ = throwError(new Error(message));
        this.targetElectronsPerSub$ = throwError(new Error(message));
        this.shotNoise$ = throwError(new Error(message));
        this.skyElectronsPerSecond$ = throwError(new Error(message));
        this.skyElectronsPerSub$ = throwError(new Error(message));
        this.skyNoise$ = throwError(new Error(message));
        this.darkSignalPerSub$ = throwError(new Error(message));
        this.darkNoise$ = throwError(new Error(message));
        this.totalNoisePerSub$ = throwError(new Error(message));
        this.signalToNoisePerSub$ = throwError(new Error(message));
        this.totalSignalToNoiseOfStack$ = throwError(new Error(message));
        this.totalIntegrationTime$ = throwError(new Error(message));
    }

    init() {
        if (this.aperture$ === undefined || this.centralObstruction$ === undefined || this.totalReflectanceTransmittance$ === undefined) {
            this.clearApertureEquivalent$ = throwError(new Error('Requires aperture$, centralObstruction$, and totalReflectanceTransmittance$'));
        }
        else {
            this.clearApertureEquivalent$ = combineLatest(
                this.aperture$,
                this.centralObstruction$,
                this.totalReflectanceTransmittance$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateClearApertureEquivalent(value[0], value[1], value[2]))
            );
        }

        if (this.pixelSize$ === undefined || this.binning$ === undefined || this.focalLength$ === undefined) {
            this.imageResolution$ = throwError(new Error('Requires pixelSize$, binning$, and focalLength$'));
        }
        else {
            this.imageResolution$ = combineLatest(
                this.pixelSize$,
                this.binning$,
                this.focalLength$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateImageResolution(value[0], value[1], value[2]))
            );
        }

        this.pixelSurface$ = this.imageResolution$.pipe(map(value => U235AstroSyncSNR.calculatePixelSurface(value)));

        if (this.fluxAttenuation$ === undefined || this.surfaceBrightness$ === undefined || this.quantumEfficiency$ === undefined) {
            this.targetElectronsPerSecond$ = throwError(new Error('Requires fluxAttentuation$, surfaceBrightness$ and quantumEfficiency$'));
        }
        else {
            this.targetElectronsPerSecond$ = combineLatest(
                this.clearApertureEquivalent$,
                this.fluxAttenuation$,
                this.surfaceBrightness$,
                this.pixelSurface$,
                this.quantumEfficiency$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateElectronsPerSecond(value[0], value[1], value[2], value[3], value[4]))
            );
        }

        if (this.exposure$ === undefined) {
            this.targetElectronsPerSub$ = throwError(new Error('Requires exposure$'));
        }
        else {
            this.targetElectronsPerSub$ = combineLatest(
                this.targetElectronsPerSecond$,
                this.exposure$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateElectronsPerSub(value[0], value[1]))
            );
        }

        this.shotNoise$ = this.targetElectronsPerSub$.pipe(map(value => U235AstroSyncSNR.calculateNoisePerSub(value)));

        if (this.fluxAttenuation$ === undefined || this.skyBrightness$ === undefined || this.quantumEfficiency$ === undefined) {
            this.skyElectronsPerSecond$ = throwError(new Error('Requires fluxAttentuation$, skyBrightness$ and quantumEfficiency$'));
        }
        else {
            this.skyElectronsPerSecond$ = combineLatest(
                this.clearApertureEquivalent$,
                this.fluxAttenuation$,
                this.skyBrightness$,
                this.pixelSurface$,
                this.quantumEfficiency$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateElectronsPerSecond(value[0], value[1], value[2], value[3], value[4]))
            );
        }

        if (this.exposure$ === undefined) {
            this.skyElectronsPerSub$ = throwError(new Error('Requires exposure$'));
        }
        else {
            this.skyElectronsPerSub$ = combineLatest(
                this.skyElectronsPerSecond$,
                this.exposure$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateElectronsPerSub(value[0], value[1]))
            );
        }

        this.skyNoise$ = this.skyElectronsPerSub$.pipe(map(value => U235AstroSyncSNR.calculateNoisePerSub(value)));

        if (this.darkCurrent$ === undefined || this.exposure$ === undefined || this.binning$ === undefined) {
            this.darkSignalPerSub$ = throwError(new Error('Requires darkCurrent$, exposure$, and binning$'));
        }
        else {
            this.darkSignalPerSub$ = combineLatest(
                this.darkCurrent$,
                this.exposure$,
                this.binning$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateElectronsPerSub(value[0], value[1]) * value[2] * value[2])
            );
        }

        this.darkNoise$ = this.darkSignalPerSub$.pipe(map(value => U235AstroSyncSNR.calculateNoisePerSub(value)));

        if (this.readNoise$ === undefined) {
            this.totalNoisePerSub$ = throwError(new Error('Requires readNoise$'));
        }
        else {
            this.totalNoisePerSub$ = combineLatest(
                this.readNoise$,
                this.shotNoise$,
                this.skyNoise$,
                this.darkNoise$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateTotalNoisePerSub(value[0], value[1], value[2], value[3]))
            );
        }

        this.signalToNoisePerSub$ = combineLatest(
            this.targetElectronsPerSub$,
            this.totalNoisePerSub$
        ).pipe(
            map(value => U235AstroSyncSNR.calculateSignalToNoisePerSub(value[0], value[1]))
        );

        if (this.exposure$ === undefined || this.numberOfSubs$ === undefined) {
            this.totalIntegrationTime$ = throwError(new Error('Requires exposure$ and numberOfSubs$'));
        }
        else {
            this.totalIntegrationTime$ = combineLatest(
                this.exposure$,
                this.numberOfSubs$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateTotalIntegrationTime(value[0], value[1]))
            )
        }

        if (this.numberOfSubs$ === undefined) {
            this.totalSignalToNoiseOfStack$ = throwError(new Error('Requires numberOfSubs$'));
        }
        else {
            this.totalSignalToNoiseOfStack$ = combineLatest(
                this.signalToNoisePerSub$,
                this.numberOfSubs$
            ).pipe(
                map(value => U235AstroSyncSNR.calculateTotalSignalToNoiseOfStack(value[0], value[1]))
            )
        }

    }
}
