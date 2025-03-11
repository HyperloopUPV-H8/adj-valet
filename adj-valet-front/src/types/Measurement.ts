export type Measurement = {
    id: string;
    name: string;
    type: string;
    displayUnits: string;
    podUnits: string;
    enumValues: string[];
    above: { safe: number; warning: number };
    below: { safe: number; warning: number };
    out_of_range: [number, number];
};
