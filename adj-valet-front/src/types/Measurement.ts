export type MeasurementId = string;

export interface Measurement {
    id: MeasurementId,
    name: string,
    type: string,
    podUnits: string,
    displayUnits: string,
    safeRange: number[],
    warningRange: number[]
}