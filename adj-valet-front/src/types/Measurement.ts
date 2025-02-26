export type MeasurementId = string;

export type MeasurementInfo = {
    name: string;
    type: string;
    podUnits: string;
    displayUnits: string;
    enumValues: string[];
    safeRange: number[];
    warningRange: number[];
};

export type Measurement = Record<MeasurementId, MeasurementInfo>;