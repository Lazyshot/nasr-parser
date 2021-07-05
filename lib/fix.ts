import { createReadStream } from "fs";
import { createInterface } from "readline";
import { LatLong, parseFormattedLat, parseFormattedLon } from "./latlong";

export interface Fix {
    id: string;
    state: string;
    region: string;

    military: boolean;

    artcc: string;
    lowArtcc: string;

    location: LatLong;
}

function parseFix1Line(line: string): Fix {
    return {
        id: line.substr(4, 30).trim(),
        state: line.substr(34, 30).trim(),
        region: line.substr(64, 2).trim(),

        military: line.substr(94, 3).trim() == "MIL",
        artcc: line.substr(233, 4).trim(),
        lowArtcc: line.substr(237, 4).trim(),

        location: {
            latitude: parseFormattedLat(line.substr(66, 14).trim()),
            longitude: parseFormattedLon(line.substr(80, 14).trim())
        }
    }
}

export async function readFixFile(s: string): Promise<Fix[]> {
    const fileStream = createReadStream(s);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let fixes = new Map<string, Fix>();

    for await (const line of rl) {
        const recordType = line.slice(0, 4);

        switch(recordType) {
            case "FIX1":
                const fixPart = parseFix1Line(line);
                const fixKey = fixPart.id + "_" + fixPart.state;
                const oldFix = fixes.get(fixKey);
                if (oldFix === undefined) {
                    fixes.set(fixKey, fixPart);
                } else {
                    fixes.set(fixKey, {...oldFix, ...fixPart})
                }
                break;
        }
    }

    return Array.from(fixes.values());
}
