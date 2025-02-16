import { Measurement } from "./Measurement";
import { Packet } from "./Packet";

export interface Board {
    board_id: number,
    board_ip: string,
    measurements: Measurement[],
    packets: Packet[]
}