export type Measurement = {
    id: string;
    name: string;
    type: string;
    podUnits: string;
    displayUnits: string;
    enumValues: string[];
    safeRange: number[];
    warningRange: number[];
};