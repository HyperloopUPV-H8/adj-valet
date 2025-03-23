export type Measurement = {
    id: string;
    name: string;
    type: string;
    displayUnits: string;
    podUnits: string;
    enumValues: string[];
    above: Range;
    below: Range;
    out_of_range: ArrayRange;
};

export type Range = {
    safe: number;
    warning: number;
};

export type ArrayRange = [number, number]; 