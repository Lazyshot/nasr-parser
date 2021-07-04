import { Airport, readAirportFile } from './airport';
import { Runway, RunwayEnd } from './runway';
import { LatLong } from './latlog';

interface Data {
    airports: Airport[];
}

const parseFile = async function(dataDir: string): Promise<Data> {

    return {
        airports: await readAirportFile(dataDir + "/APT.txt"),
    }
}

export {Airport, Runway, RunwayEnd, LatLong, Data, parseFile};