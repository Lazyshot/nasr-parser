export interface LatLong {
    latitude: number; // in format ±DDMMSS.SSSS
    longitude: number;
}

export function parseFormattedLat(part: string): number {
    const latStr = part.slice(0, -1);
    const latHemi = part.substr(-1);
    const [latD, latM, latS] = latStr.split("-");
    let lat = 10000 * new Number(latD).valueOf() + 
              100 * new Number(latM).valueOf() +
              new Number(latS).valueOf();

    if (latHemi == "S") lat = lat * -1;

    return lat;
}

export function parseFormattedLon(part: string): number {
    const lonStr = part.slice(0, -1);
    const lonHemi = part.substr(-1);
    const [lonD, lonM, lonS] = lonStr.split("-");
    let lon = 10000 * new Number(lonD).valueOf() + 
              100 * new Number(lonM).valueOf() +
              new Number(lonS).valueOf();

    if (lonHemi == "E") lon = lon * -1;

    return lon;
}

export function parseLatLong(linePart: string): LatLong {
    const latPart = linePart.substr(0, 15).trim();
    const lonPart = linePart.substr(27, 15).trim();

    return {
        latitude: parseFormattedLat(latPart),
        longitude: parseFormattedLon(lonPart)
    }
}