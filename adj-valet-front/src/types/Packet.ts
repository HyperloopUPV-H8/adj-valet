export type PacketId = string;

export type PacketInfo = {
    type: string;
    name: string;
    variables: Record<string, string>[];
};

export type Packet = Record<PacketId, PacketInfo>;