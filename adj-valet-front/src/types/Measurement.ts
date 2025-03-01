export interface Measurement {
    id: string,
    name: string,
    type: string,
    podUnits: string,
    displayUnits: string,
    safeRange: number[],
    warningRange: number[]
}