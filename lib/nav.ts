import { createReadStream } from "fs";
import { createInterface } from "readline";
import { LatLong, parseFormattedLat, parseFormattedLon } from "./latlong";

export interface NavAid {
    dlid: string;
    type: string;
    identifier: string;
    
    name: string;

    state: string;
    stateCode: string;
    country: string;
    countryCode: string;

    class: string;

    artcc: string;
    lowArtcc: string;

    position: LatLong;
}


function parseNav1Line(line: string): NavAid {
    return {
        dlid: line.substr(4, 4).trim(),
        type: line.substr(8, 20).trim(),
        identifier: line.substr(28, 4).trim(),

        name: line.substr(42, 30).trim(),
        state: line.substr(112, 30).trim(),
        stateCode: line.substr(142, 2).trim(),
        country: line.substr(147, 30).trim(),
        countryCode: line.substr(177, 2).trim(),

        class: line.substr(281, 11).trim(),

        artcc: line.substr(303, 4).trim(),
        lowArtcc: line.substr(337, 4).trim(),
        position: {
            latitude: parseFormattedLat(line.substr(371, 14).trim()),
            longitude: parseFormattedLon(line.substr(396, 14).trim())
        }
    }
}


export async function readNavFile(s: string): Promise<NavAid[]> {
    const fileStream = createReadStream(s);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let navaids: NavAid[] = [];

    for await (const line of rl) {
        const recordType = line.slice(0, 4);

        switch(recordType) {
            case "NAV1":
                navaids.push(parseNav1Line(line));
                break;
        }
    }

    return navaids;
}