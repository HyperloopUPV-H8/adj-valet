import { Packet } from "../types/Packet";   

interface Props {
    packet: Packet;
}

export const PacketForm = ({ packet }: Props) => {
    return (
        <div>
            <h2 className="mb-2 text-xl font-bold text-zinc-600">Packet ID</h2>
            {packet.id}
        </div>
    );
}
