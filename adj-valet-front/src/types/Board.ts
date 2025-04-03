import { Measurement } from "./Measurement";
import { Packet } from "./Packet";

export type BoardName = string;

export type BoardInfo = {
    board_id: number;
    board_ip: string;
    measurements: Measurement[];
    packets: Packet[];
}

export type Board = Record<BoardName, BoardInfo>;