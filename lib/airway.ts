import { createReadStream } from "fs";
import { createInterface } from "readline";
import { LatLong, parseFormattedLat, parseFormattedLon, parseLatLong } from "./latlong";

export interface Airway {
    designation: string;
    type: string;
    
    points: AirwayPoint[];
}

export interface AirwayPoint {
    seqno: number;
    trackOutbound: string;
    distToChangover: number;
    trackInbound: string;
    distToNextPoint: number;

    magCourse: number;

    artcc: string;

    navaid: string;
    navaidCode: string;
    navaidType: string;
    position: LatLong;
}


function parseAirway1Line(line: string): AirwayPoint {
    return {
        seqno: new Number(line.substr(10, 5).trim()).valueOf(),
        trackOutbound: line.substr(25, 7).trim(),
        distToChangover: new Number(line.substr(32, 5).trim()).valueOf(),
        trackInbound: line.substr(37, 7).trim(),
        distToNextPoint: new Number(line.substr(44, 6).trim()).valueOf(),

        magCourse: new Number(line.substr(56, 6).trim()).valueOf(),

        artcc: line.substr(141, 3).trim(),

        navaid: "",
        navaidCode: "",
        navaidType: "",
        position: {
            latitude: 0,
            longitude: 0
        }
    }
}

function parseAirway2Line(line: string): Partial<AirwayPoint> {
    return {
        seqno: new Number(line.substr(10, 5).trim()).valueOf(),
        navaid: line.substr(15, 30).trim(),
        navaidCode: line.substr(116, 4).trim(),
        navaidType: line.substr(64, 15).trim() == "FIX" ? "FIX" : line.substr(45, 19).trim(),
        position: {
            latitude: parseFormattedLat(line.substr(83, 14).trim()),
            longitude: parseFormattedLon(line.substr(97, 14).trim())
        }
    }
}

export async function readAirwaysFile(s: string): Promise<Airway[]> {
    const fileStream = createReadStream(s);
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let airways = new Map<string, Airway>();

    for await (const line of rl) {
        const recordType = line.slice(0, 4);
        const [airwayDesignation, airwayType] = [line.substr(4,5).trim(), line.substr(9, 1).trim()];
        const airwayKey = airwayDesignation + ":" + airwayType;
        let currAirway = airways.get(airwayKey);
        if (currAirway === undefined) {
            currAirway = {
                designation: airwayDesignation,
                type: airwayType,

                points: []
            }
        }

        switch(recordType) {
            case "AWY1":
                currAirway.points.push(parseAirway1Line(line));
                break;
            case "AWY2":
                const airway2Pt = parseAirway2Line(line);
                const curPointIdx = currAirway.points.findIndex((p) => p.seqno === airway2Pt.seqno);
                if (curPointIdx == -1)
                    throw "last point couldn't be found for awy2 line";

                currAirway.points[curPointIdx] = {...currAirway.points[curPointIdx], ...airway2Pt}
                break;
        }

        airways.set(airwayKey, currAirway);
    }

    return Array.from(airways.values());
}