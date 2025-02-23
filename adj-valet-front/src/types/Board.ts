import { Measurement } from "./Measurement";
import { Packet } from "./Packet";

export type Board = {
    board_id: number;
    board_ip: number;
    measurements: Record<string, Measurement>[];
    packets: Record<string, Packet>[];
};