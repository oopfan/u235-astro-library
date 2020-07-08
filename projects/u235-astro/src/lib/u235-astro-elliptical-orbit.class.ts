import { U235AstroEllipticalOrbitalElements, U235AstroOrbitalPosition, U235AstroStandishOrbitalElements } from './u235-astro.interfaces';
import { U235AstroVector3D } from './u235-astro-vector3d.class';
import { U235AstroMatrix3D } from './u235-astro-matrix3d.class';

export class U235AstroEllipticalOrbit {
    private elements: U235AstroEllipticalOrbitalElements;
    private julianDate: number;
    private orbitalPosition: U235AstroOrbitalPosition;
    private eclipticPosition: U235AstroVector3D;
    private equatorialPosition: U235AstroVector3D;
    private matEclToEqu2000: U235AstroMatrix3D;

    constructor(elements: U235AstroEllipticalOrbitalElements) {
        this.elements = elements;
        this.julianDate = 2451545.0;
        this.matEclToEqu2000 = new U235AstroMatrix3D();
        this.matEclToEqu2000.setRotateX(-23.43928 / 180 * Math.PI);
        this.updateOrbitalPosition();
        this.updateEclipticPosition();
        this.updateEquatorialPosition();
    }

    setJulianDate(jd: number) {
        this.julianDate = jd;
        this.updateOrbitalPosition();
        this.updateEclipticPosition();
        this.updateEquatorialPosition();
    }

    getOrbitalPosition(): U235AstroOrbitalPosition {
        return this.orbitalPosition;
    }

    getEclipticPosition(): U235AstroVector3D {
        return this.eclipticPosition;
    }

    getEquatorialPosition(): U235AstroVector3D {
        return this.equatorialPosition;
    }

    private updateOrbitalPosition() {
        this.orbitalPosition = U235AstroEllipticalOrbit.calculateOrbitalPosition(this.julianDate, this.elements);
    }

    private updateEclipticPosition() {
        this.eclipticPosition = U235AstroEllipticalOrbit.calculateEclipticPosition(this.julianDate, this.elements, this.orbitalPosition);
    }

    private updateEquatorialPosition() {
        this.equatorialPosition = new U235AstroVector3D();
        this.equatorialPosition.assign(this.eclipticPosition);
        this.equatorialPosition.matrixMultiply(this.matEclToEqu2000);
    }

    static calculateOrbitalPosition(
        julianDate: number,
        elements: U235AstroEllipticalOrbitalElements
        ): U235AstroOrbitalPosition {

        const T = (julianDate - 2451545) / 36525;
        const semiMajorAxis = elements.semiMajorAxis[0] + T * elements.semiMajorAxis[1];
        const eccentricity = elements.eccentricity[0] + T * elements.eccentricity[1];
        const meanLongitude = elements.meanLongitude[0] + T * elements.meanLongitude[1];
        const argumentOfPerihelion = elements.argumentOfPerihelion[0] + T * elements.argumentOfPerihelion[1];

        let meanAnomaly = meanLongitude - argumentOfPerihelion;
        if (elements.extra !== undefined) {
            const fT = elements.extra[3] * T * Math.PI / 180;
            meanAnomaly += elements.extra[0] * T * T;
            meanAnomaly += elements.extra[1] * Math.cos(fT);
            meanAnomaly += elements.extra[2] * Math.sin(fT);
        }

        meanAnomaly = meanAnomaly % 360;
        if (meanAnomaly < 0) {
            meanAnomaly = meanAnomaly + 360;
        }
        if (meanAnomaly > 180) {
            meanAnomaly = meanAnomaly - 360;
        }

        const eccentricAnomaly = U235AstroEllipticalOrbit.danby(meanAnomaly, eccentricity);

        const x = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
        const y = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
        const z = 0;

        const trueAnomaly = Math.atan2(y, x);

        const coordinates = new U235AstroVector3D();
        coordinates.setElement(1, x);
        coordinates.setElement(2, y);
        coordinates.setElement(3, z);

        return {
            meanAnomaly,
            eccentricAnomaly: eccentricAnomaly / Math.PI * 180,
            trueAnomaly: trueAnomaly / Math.PI * 180,
            coordinates
        }
    }

    static calculateEclipticPosition(
        julianDate: number,
        elements: U235AstroEllipticalOrbitalElements,
        orbitalPosition: U235AstroOrbitalPosition
        ): U235AstroVector3D {

        const T = (julianDate - 2451545) / 36525;
        const inclination = elements.inclination[0] + T * elements.inclination[1];
        const argumentOfPerihelion = elements.argumentOfPerihelion[0] + T * elements.argumentOfPerihelion[1];
        const longitudeOfAscendingNode = elements.longitudeOfAscendingNode[0] + T * elements.longitudeOfAscendingNode[1];

        const rot1 = new U235AstroMatrix3D();
        const rot2 = new U235AstroMatrix3D();
        const rot3 = new U235AstroMatrix3D();

        rot1.setRotateZ((longitudeOfAscendingNode - argumentOfPerihelion) * Math.PI / 180);
        rot2.setRotateX(-inclination * Math.PI / 180);
        rot3.setRotateZ(-longitudeOfAscendingNode * Math.PI / 180);

        const eclipticPosition = new U235AstroVector3D();
        eclipticPosition.setElement(1, orbitalPosition.coordinates.getElement(1));
        eclipticPosition.setElement(2, orbitalPosition.coordinates.getElement(2));
        eclipticPosition.setElement(3, orbitalPosition.coordinates.getElement(3));

        eclipticPosition.matrixMultiply(rot1);
        eclipticPosition.matrixMultiply(rot2);
        eclipticPosition.matrixMultiply(rot3);

        return eclipticPosition;
    }

    static danby(meanAnomaly: number, eccentricity: number): number {
        meanAnomaly = meanAnomaly * Math.PI / 180;
        let eccentricAnomaly = U235AstroEllipticalOrbit.danbyFirstGuess(meanAnomaly, eccentricity);
        eccentricAnomaly = U235AstroEllipticalOrbit.danbySolution(eccentricAnomaly, meanAnomaly, eccentricity);
        return eccentricAnomaly;
    }

    static danbyFirstGuess(meanAnomaly: number, eccentricity: number): number {
        const eccentricAnomaly = meanAnomaly + (0.85 * eccentricity * Math.sign(Math.sin(meanAnomaly)));
        return eccentricAnomaly;
    }

    static danbySolution(eccentricAnomaly: number, meanAnomaly: number, eccentricity: number): number {

        const maxError = 0.000001;
        const maxIterations = 10;

        let sinE = Math.sin(eccentricAnomaly);
        let cosE = Math.cos(eccentricAnomaly);
        let iter = 0;

        while (iter < maxIterations) {
            const f = eccentricAnomaly - eccentricity * sinE - meanAnomaly;
            if (Math.abs(f) < maxError) {
                break;
            }
            const fp = 1 - eccentricity * cosE;
            const fpp = eccentricity * sinE;
            const fppp = eccentricity * cosE;
            let accum = fp;
            const del = -f / accum;
            accum += del * fpp / 2;
            const delstar = -f / accum;
            accum += delstar * delstar * fppp / 6;
            const deln = -f / accum;
            eccentricAnomaly += deln;
            sinE = Math.sin(eccentricAnomaly);
            cosE = Math.cos(eccentricAnomaly);
            iter++;
        }

        if (iter >= maxIterations) {
            throw new Error(`U235AstroEllipticalOrbit.danbySolution Error: could not find solution after ${maxIterations} iterations.`);
        }
        return eccentricAnomaly;
    }

    static getStandishOrbitalElements(): U235AstroStandishOrbitalElements {
        return {
            from_3000bc_to_3000ad: {
                mercury: {
                    semiMajorAxis: [0.38709843, 0],
                    eccentricity: [0.20563661, 0.00002123],
                    inclination: [7.00559432, -0.00590158],
                    meanLongitude: [252.25166724, 149472.67486623],
                    argumentOfPerihelion: [77.45771895, 0.15940013],
                    longitudeOfAscendingNode: [48.33961819, -0.12214182]
                },
                venus: {
                    semiMajorAxis: [0.72332102, -0.00000026],
                    eccentricity: [0.00676399, -0.00005107],
                    inclination: [3.39777545, 0.00043494],
                    meanLongitude: [181.9797085, 58517.8156026],
                    argumentOfPerihelion: [131.76755713, 0.05679648],
                    longitudeOfAscendingNode: [76.67261496, -0.27274174]
                },
                earth: {
                    semiMajorAxis: [1.00000018, -0.00000003],
                    eccentricity: [0.01673163, -0.00003661],
                    inclination: [-0.00054346, -0.01337178],
                    meanLongitude: [100.46691572, 35999.37306329],
                    argumentOfPerihelion: [102.93005885, 0.3179526],
                    longitudeOfAscendingNode: [-5.11260389, -0.24123856]
                },
                mars: {
                    semiMajorAxis: [1.52371243, 0.00000097],
                    eccentricity: [0.09336511, 0.00009149],
                    inclination: [1.85181869, -0.00724757],
                    meanLongitude: [-4.56813164, 19140.29934243],
                    argumentOfPerihelion: [-23.91744784, 0.45223625],
                    longitudeOfAscendingNode: [49.71320984, -0.26852431]
                },
                jupiter: {
                    semiMajorAxis: [5.20248019, -0.00002864],
                    eccentricity: [0.0485359, 0.00018026],
                    inclination: [1.29861416, -0.00322699],
                    meanLongitude: [34.33479152, 3034.90371757],
                    argumentOfPerihelion: [14.27495244, 0.18199196],
                    longitudeOfAscendingNode: [100.29282654, 0.13024619],
                    extra: [-0.00012452, 0.0606406, -0.35635438, 38.35125]
                },
                saturn: {
                    semiMajorAxis: [9.54149883, -0.00003065],
                    eccentricity: [0.05550825, -0.00032044],
                    inclination: [2.49424102, 0.00451969],
                    meanLongitude: [50.07571329, 1222.11494724],
                    argumentOfPerihelion: [92.86136063, 0.54179478],
                    longitudeOfAscendingNode: [113.63998702, -0.25015002],
                    extra: [0.00025899, -0.13434469, 0.87320147, 38.35125]
                },
                uranus: {
                    semiMajorAxis: [19.18797948, -0.00020455],
                    eccentricity: [0.0468574, -0.0000155],
                    inclination: [0.77298127, -0.00180155],
                    meanLongitude: [314.20276625, 428.49512595],
                    argumentOfPerihelion: [172.43404441, 0.09266985],
                    longitudeOfAscendingNode: [73.96250215, 0.05739699],
                    extra: [0.00058331, -0.97731848, 0.17689245, 7.67025]
                },
                neptune: {
                    semiMajorAxis: [30.06952752, 0.00006447],
                    eccentricity: [0.00895439, 0.00000818],
                    inclination: [1.7700552, 0.000224],
                    meanLongitude: [304.22289287, 218.46515314],
                    argumentOfPerihelion: [46.68158724, 0.01009938],
                    longitudeOfAscendingNode: [131.78635853, -0.00606302],
                    extra: [-0.00041348, 0.68346318, -0.10162547, 7.67025]
                },
                pluto: {
                    semiMajorAxis: [39.48686035, 0.00449751],
                    eccentricity: [0.24885238, 0.00006016],
                    inclination: [17.1410426, 0.00000501],
                    meanLongitude: [238.96535011, 145.18042903],
                    argumentOfPerihelion: [224.09702598, -0.00968827],
                    longitudeOfAscendingNode: [110.30167986, -0.00809981],
                    extra: [-0.01262724, 0, 0, 0]
                }
            },
            from_1800ad_to_2050ad: {
                mercury: {
                    semiMajorAxis: [0.38709927, 0.00000037],
                    eccentricity: [0.20563593, 0.00001906],
                    inclination: [7.00497902, -0.00594749],
                    meanLongitude: [252.2503235, 149472.67411175],
                    argumentOfPerihelion: [77.45779628, 0.16047689],
                    longitudeOfAscendingNode: [48.33076593, -0.12534081]
                },
                venus: {
                    semiMajorAxis: [0.72333566, 0.00000390],
                    eccentricity: [0.00677672, -0.00004107],
                    inclination: [3.39467605, -0.0007889],
                    meanLongitude: [181.9790995, 58517.81538729],
                    argumentOfPerihelion: [131.60246718, 0.00268329],
                    longitudeOfAscendingNode: [76.67984255, -0.27769418]
                },
                earth: {
                    semiMajorAxis: [1.00000261, 0.00000562],
                    eccentricity: [0.01671123, -0.00004392],
                    inclination: [-0.00001531, -0.01294668],
                    meanLongitude: [100.46457166, 35999.37244981],
                    argumentOfPerihelion: [102.93768193, 0.32327364],
                    longitudeOfAscendingNode: [0, 0]
                },
                mars: {
                    semiMajorAxis: [1.52371034, 0.00001847],
                    eccentricity: [0.0933941, 0.00007882],
                    inclination: [1.84969142, -0.00813131],
                    meanLongitude: [-4.55343205, 19140.30268499],
                    argumentOfPerihelion: [-23.94362959, 0.44441088],
                    longitudeOfAscendingNode: [49.55953891, -0.29257343]
                },
                jupiter: {
                    semiMajorAxis: [5.202887, -0.00011607],
                    eccentricity: [0.04838624, -0.00013253],
                    inclination: [1.30439695, -0.00183714],
                    meanLongitude: [34.39644051, 3034.74612775],
                    argumentOfPerihelion: [14.72847983, 0.21252668],
                    longitudeOfAscendingNode: [100.47390909, 0.20469106]
                },
                saturn: {
                    semiMajorAxis: [9.53667594, -0.0012506],
                    eccentricity: [0.05386179, -0.00050991],
                    inclination: [2.48599187, 0.00193609],
                    meanLongitude: [49.95424423, 1222.49362201],
                    argumentOfPerihelion: [92.59887831, -0.41897216],
                    longitudeOfAscendingNode: [113.66242448, -0.28867794]
                },
                uranus: {
                    semiMajorAxis: [19.18916464, -0.00196176],
                    eccentricity: [0.04725744, -0.00004397],
                    inclination: [0.77263783, -0.00242939],
                    meanLongitude: [313.23810451, 428.48202785],
                    argumentOfPerihelion: [170.9542763, 0.40805281],
                    longitudeOfAscendingNode: [74.01692503, 0.04240589]
                },
                neptune: {
                    semiMajorAxis: [30.06992276, 0.00026291],
                    eccentricity: [0.00859048, 0.00005105],
                    inclination: [1.77004347, 0.00035372],
                    meanLongitude: [-55.12002969, 218.45945325],
                    argumentOfPerihelion: [44.96476227, -0.3224146],
                    longitudeOfAscendingNode: [131.78422574, -0.00508664]
                },
                pluto: {
                    semiMajorAxis: [39.48211675, -0.00031596],
                    eccentricity: [0.2488273, 0.0000517],
                    inclination: [17.14001206, 0.00004818],
                    meanLongitude: [238.92903833, 145.20780515],
                    argumentOfPerihelion: [224.06891629, -0.04062942],
                    longitudeOfAscendingNode: [110.30393684, -0.01183482]
                }
            }
        }
    }
    
}
