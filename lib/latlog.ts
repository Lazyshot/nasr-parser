export interface LatLong {
    latitude: number; // in format ±DDMMSS.SSSS
    longitude: number;
}

export function parseLatLong(linePart: string): LatLong {
    const latStr = linePart.substr(0, 15).trim().slice(0, -1);
    const latHemi = linePart.substr(0, 15).trim().substr(-1);
    const lonStr = linePart.substr(27, 14).trim().slice(0, -1);
    const lonHemi = linePart.substr(41, 1).substr(-1);

    const [latD, latM, latS] = latStr.split("-");
    let lat = 10000 * new Number(latD).valueOf() + 
              100 * new Number(latM).valueOf() +
              new Number(latS).valueOf();

    const [lonD, lonM, lonS] = lonStr.split("-");
    let lon = 10000 * new Number(lonD).valueOf() + 
            100 * new Number(lonM).valueOf() +
            new Number(lonS).valueOf();
    
    if (latHemi == "S") lat = lat * -1;
    if (lonHemi == "E") lon = lon * -1;

    return {
        latitude: lat,
        longitude: lon
    }
}