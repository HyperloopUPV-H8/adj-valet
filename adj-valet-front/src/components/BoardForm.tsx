import { useADJStore } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { Input } from './Input';
import { PacketCard } from './PacketCard';
import { Modal } from './Modal';
import { useState } from 'react';
import { Packet } from '../types/Packet';
import { PacketForm } from './PacketForm';
interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
}

export const BoardForm = ({ boardName, boardInfo }: Props) => {
    const { updateBoard } = useADJStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

    return (
        <div className="flex w-[25rem] flex-col">
            <h2 className="mb-2 text-xl font-bold text-zinc-600">Board ID</h2>
            <Input
                object={boardInfo}
                field={'board_id'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <h2 className="mt-8 mb-2 text-xl font-bold text-zinc-600">
                Board IP
            </h2>
            <Input
                object={boardInfo}
                field={'board_ip'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <h2 className="mt-8 mb-2 text-xl font-bold text-zinc-600">
                Packets
            </h2>
            <ul>
                {boardInfo.packets.map((packet) => (
                    <li key={packet.id}>
                        <PacketCard
                            packetId={packet.id}
                            packetName={packet.name}
                            onSelect={() => {
                                setSelectedPacket(packet);
                                setIsModalOpen(true);
                            }}
                        />
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedPacket && <PacketForm packet={selectedPacket} />}
            </Modal>
        </div>
    );
};
