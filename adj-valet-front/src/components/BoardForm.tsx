import { useADJStore } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { Input } from './Input';
import { PacketCard } from './PacketCard';
import { Modal } from './Modal';
import { useState } from 'react';
import { Packet } from '../types/Packet';
import { PacketForm } from './PacketForm';
import { MeasurementForm } from './MeasurementForm';
import { Measurement } from '../types/Measurement';
import { MeasurementCard } from './MeasurementCard';
interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
}

export const BoardForm = ({ boardName, boardInfo }: Props) => {
    const { updateBoard } = useADJStore();
    const [isPacketModalOpen, setIsPacketModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
    const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] =
        useState<Measurement | null>(null);

    return (
        <div className="flex w-full flex-col">
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
            <ul className="flex flex-wrap gap-4">
                {boardInfo.packets.map((packet) => (
                    <li key={packet.id}>
                        <PacketCard
                            packetId={packet.id}
                            packetName={packet.name}
                            onSelect={() => {
                                setSelectedPacket(packet);
                                setIsPacketModalOpen(true);
                            }}
                        />
                    </li>
                ))}
            </ul>

            <div className="mt-8 mb-4 flex items-center gap-4">
                <h2 className="text-xl font-bold text-zinc-600">
                    Measurements
                </h2>
                <button
                    className="bg-hupv-blue hover:bg-hupv-blue/80 w-fit cursor-pointer rounded-lg px-2 py-1 text-white"
                    onClick={() => {
                        setSelectedMeasurement({
                            id: '',
                            name: '',
                            type: '',
                            displayUnits: '',
                            podUnits: '',
                            enumValues: [],
                            above: { safe: 0, warning: 0 },
                            below: { safe: 0, warning: 0 },
                            out_of_range: [0, 0],
                        });
                        setIsMeasurementModalOpen(true);
                    }}
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <ul className="flex flex-wrap gap-4">
                    {boardInfo.measurements.map((measurement) => (
                        <li key={measurement.id}>
                            <MeasurementCard
                                measurementName={measurement.name}
                                measurementId={measurement.id}
                                onSelect={() => {
                                    setSelectedMeasurement(measurement);
                                    setIsMeasurementModalOpen(true);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <Modal
                isOpen={isPacketModalOpen}
                onClose={() => setIsPacketModalOpen(false)}
            >
                {selectedPacket && (
                    <PacketForm
                        packet={selectedPacket}
                        boardName={boardName}
                        onSubmit={() => setIsPacketModalOpen(false)}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isMeasurementModalOpen}
                onClose={() => setIsMeasurementModalOpen(false)}
            >
                {selectedMeasurement && (
                    <MeasurementForm
                        boardName={boardName}
                        measurement={selectedMeasurement}
                        isCreating={selectedMeasurement.id === ''}
                        onSubmit={() => setIsMeasurementModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};
