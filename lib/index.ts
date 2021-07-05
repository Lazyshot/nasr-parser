import { Airport, readAirportFile } from './airport';
import { Runway, RunwayEnd } from './runway';
import { LatLong } from './latlong';
import { Fix, readFixFile } from './fix';
import { Airway, AirwayPoint, readAirwaysFile } from './airway';
import { NavAid, readNavFile } from './nav';
import { ARTCC, readARBFile } from './artcc';

interface Data {
    airports: Airport[];
    fixes: Fix[];
    airways: Airway[];
    navaids: NavAid[];
    artccs: ARTCC[];
}

const parseFile = async function(dataDir: string): Promise<Data> {
    return {
        airports: await readAirportFile(dataDir + "/APT.txt"),
        fixes: await readFixFile(dataDir + "/FIX.txt"),
        airways: await readAirwaysFile(dataDir + "/AWY.txt"),
        navaids: await readNavFile(dataDir + "/NAV.txt"),
        artccs: await readARBFile(dataDir + "/ARB.txt")
    }
}

export {Airport, Runway, RunwayEnd, LatLong, Fix, Airway, AirwayPoint, NavAid, ARTCC, Data, parseFile};