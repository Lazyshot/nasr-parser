import { LatLong, parseLatLong } from "./latlog";

export interface Runway {
    facilityNumber: string;
    stateCode: string;

    name: string;

    length: number;
    width: number;
    surfaceType: string;
    surfaceTreatment: string;
    
    baseEnd: RunwayEnd;
    recipEnd: RunwayEnd;
}

export interface RunwayEnd {
    identifier: string;
    truealign: number;
    
    instrumentType: string;

    rightHandPattern: boolean;

    runwayMarkingsType: string;
    runwayMarkingsCondition: string;

    positionLatLon: LatLong;
    elevationAtEnd: number;
    thresholdHeight: number;
    glidePath: number;
    displacedPos?: LatLong;
    elevationDisplaced?: number;
    displacedLength?: number;
    elevationTouchdown: number;
}

function parseRunwayEnd(linePart: string): RunwayEnd {
    return {
        identifier: linePart.substr(0, 3).trim(),
        truealign: new Number(linePart.substr(3, 3).trim()).valueOf(),

        instrumentType: linePart.substr(6, 10).trim(),

        rightHandPattern: linePart.substr(16, 1) == "Y",

        runwayMarkingsType: linePart.substr(17, 5).trim(),
        runwayMarkingsCondition: linePart.substr(22, 1),

        positionLatLon: parseLatLong(linePart.substr(23, 54)),
        elevationAtEnd: new Number(linePart.substr(77, 7).trim()).valueOf(),
        thresholdHeight: new Number(linePart.substr(84, 3).trim()).valueOf(),
        glidePath: new Number(linePart.substr(87, 4).trim()).valueOf(),
        displacedPos: parseLatLong(linePart.substr(91, 54)),
        elevationDisplaced: new Number(linePart.substr(145, 7).trim()).valueOf(),
        displacedLength: new Number(linePart.substr(152, 4).trim()).valueOf(),
        elevationTouchdown: new Number(linePart.substr(156, 7).trim()).valueOf(),
    }
}

export function parseRunwayLine(line: string): Runway {
    return {
        facilityNumber: line.substr(3, 11).trim(),
        stateCode: line.substr(14, 2),
        name: line.substr(16, 7).trim(),

        length: new Number(line.substr(23, 5).trim()).valueOf(),
        width: new Number(line.substr(28, 4).trim()).valueOf(),

        surfaceType: line.substr(32, 12).trim(),
        surfaceTreatment: line.substr(44, 5).trim(),

        baseEnd: parseRunwayEnd(line.substr(65, 222)),
        recipEnd: parseRunwayEnd(line.substr(287, 222))
    }
}