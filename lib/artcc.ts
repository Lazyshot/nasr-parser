import { createReadStream } from "fs";
import { createInterface } from "readline";
import { LatLong, parseFormattedLat, parseFormattedLon } from "./latlong";

export interface ARTCC {
    code: string;
    name: string;
    boundary: LatLong[];
}

export async function readARBFile(s: string): Promise<ARTCC[]> {
    const fileStream = createReadStream(s);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let artccs = new Map<string, ARTCC>();

    for await (const line of rl) {
        const artccCode = line.substr(0, 4).trim();
        let currARTCC = artccs.get(artccCode);
        if (currARTCC === undefined) {
           currARTCC = {
               code: artccCode,
               name: line.substr(12, 40).trim(),
               boundary: []
           }
        }

        currARTCC.boundary.push(
            {
                latitude: parseFormattedLat(line.substr(62, 14).trim()),
                longitude: parseFormattedLon(line.substr(76, 14).trim())
            }
        )

        artccs.set(artccCode, currARTCC);
    }

    return Array.from(artccs.values());
}