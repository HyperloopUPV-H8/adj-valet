export type Measurement = {
    name: string;
    type: string;
    podUnits: string;
    displayUnits: string;
    enumValues: string[];
    safeRange: number[];
    warningRange: number[];
};