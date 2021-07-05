import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { LatLong, parseLatLong } from './latlong';
import { parseRunwayLine, Runway } from './runway';

export interface Airport {
    facilityNumber: string;

    name: string;
    facilityType: string;

    IATA: string;
    regionCode: string;

    faaDistrict: string;
    stateCode: string;
    stateName: string;
    countyName: string;
    countyStateCode: string;
    cityName: string;

    effectiveDate: string;

    // ownership
    ownershipType: string;
    facilityUse: string;
    facilityOwner: string;
    ownerAddress: string;
    ownerLocation: string;
    ownerPhone: string;
    facilityManager: string;
    managerAddress: string;
    managerLocation: string;
    managerPhone: string;

    // geographic
    refPtLatLong: LatLong;
    refPtMethod: string;
    elevation: number;
    elevationMethod: string;
    magneticVar: string;
    magneticVarEpoch: number;
    trafficPatternAlt: number;
    sectionalChart: string;
    distFromCtr: number;
    dirFromCtr: string;
    landArea: number;
    
    // faa services
    artccID: string;
    artccCID: string;
    artccName: string;

    respArtccID: string;
    respArtccCID: string;
    respArtccName: string;

    runways: Runway[];
}

function parseAirportLine(line: string): Airport {
    return {
        facilityNumber: line.substr(3, 11).trim(),
        facilityType: line.substr(14, 13).trim(),
        IATA: line.substr(27, 4).trim(),
        effectiveDate: line.substr(31, 10).trim(),
        regionCode: line.substr(41, 3).trim(),
        faaDistrict: line.substr(44, 4).trim(),
        stateCode: line.substr(48, 2).trim(),
        stateName: line.substr(50, 20).trim(),
        countyName: line.substr(70, 21).trim(),
        countyStateCode: line.substr(91, 2).trim(),
        cityName: line.substr(93, 40).trim(),
        name: line.substr(133, 50).trim(),

        ownershipType: line.substr(183, 2).trim(),
        facilityUse: line.substr(185, 2).trim(),
        facilityOwner: line.substr(187, 35).trim(),
        ownerAddress: line.substr(222, 72).trim(),
        ownerLocation: line.substr(294, 45).trim(),
        ownerPhone: line.substr(339, 16).trim(),

        facilityManager: line.substr(355, 35).trim(),
        managerAddress: line.substr(390, 72).trim(),
        managerLocation: line.substr(462, 45).trim(),
        managerPhone: line.substr(507, 16).trim(),

        refPtLatLong: parseLatLong(line.substr(523, 54)),
        refPtMethod: line.substr(577, 1),
        elevation: new Number(line.substr(578, 7).trim()).valueOf(),
        elevationMethod: line.substr(585, 1),
        magneticVar: line.substr(586, 3).trim(),
        magneticVarEpoch: new Number(line.substr(589,4)).valueOf(),
        trafficPatternAlt: new Number(line.substr(593, 4).trim()).valueOf(),
        sectionalChart: line.substr(597, 30).trim(),
        distFromCtr: new Number(line.substr(627, 2).trim()).valueOf(),
        dirFromCtr: line.substr(629, 3).trim(),
        landArea: new Number(line.substr(632, 5).trim()).valueOf(),

        artccID: line.substr(637, 4).trim(),
        artccCID: line.substr(641, 3).trim(),
        artccName: line.substr(644, 30).trim(),

        respArtccID: line.substr(674, 4).trim(),
        respArtccCID: line.substr(678, 3).trim(),
        respArtccName: line.substr(681, 30).trim(),

        runways: []
    }
}

export async function readAirportFile(s: string): Promise<Airport[]> {
    const fileStream = createReadStream(s);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let airports = new Map<string, Airport>();

    for await (const line of rl) {
        const recordType = line.slice(0, 3);

        switch(recordType) {
            case "APT":
                const airport = parseAirportLine(line);
                airports.set(airport.facilityNumber, airport);
                break;
            case "RWY":
                const runway = parseRunwayLine(line);
                let runwayAirport = airports.get(runway.facilityNumber);
                if (runwayAirport == undefined) {
                    throw "invalid runway before airport defined: " + runway.facilityNumber;
                }

                runwayAirport.runways.push(runway);
                airports.set(runwayAirport.facilityNumber, runwayAirport);
                break;
        }
    }

    return Array.from(airports.values());
}