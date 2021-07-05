export interface SIDSTAR {
    code: string;
    name: string;
    
    transition: string;
    airport: string;
    points: SIDSTARPoint[];
}

export interface SIDSTARPoint {

}



export async function readStarDPFile(s: string): Promise<SIDSTAR[]> {
    return [];
}