import { MeasurementId } from "./Measurement";

export interface Packet {
    id: number,
    type: string,
    name: string,
    variables: MeasurementId[]
}