import { useADJStore } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { Input } from './Input';
import { PacketCard } from './PacketCard';
import { Modal } from './Modal';
import { useEffect, useState } from 'react';
import { Packet } from '../types/Packet';
import { PacketForm } from './PacketForm';
import { MeasurementForm } from './MeasurementForm';
import { Measurement } from '../types/Measurement';
import { MeasurementCard } from './MeasurementCard';

interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
    setSelectedSection: (section: string) => void;
}

export const BoardForm = ({ boardName, boardInfo, setSelectedSection }: Props) => {
    const { updateBoard, removeBoard, addBoard, boards } = useADJStore();
    const [isPacketModalOpen, setIsPacketModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
    const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] =
        useState<Measurement | null>(null);
    const [measurementSearch, setMeasurementSearch] = useState('');
    const [packetSearch, setPacketSearch] = useState('');
    const [filteredMeasurements, setFilteredMeasurements] = useState(boardInfo.measurements);
    const [filteredPackets, setFilteredPackets] = useState(boardInfo.packets);
    const [originalBoardName] = useState(boardName);
    const [formData, setFormData] = useState<BoardInfo>(boardInfo);

    useEffect(() => {
        setFormData(boardInfo);
    }, [boardInfo]);

    const handleBoardUpdate = (field: keyof BoardInfo, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (String(formData.board_id) !== String(boardInfo.board_id)) {
            const existingBoard = boards.find(board => {
                const boardKey = Object.keys(board)[0];
                return board[boardKey].board_id === Number(formData.board_id) && boardKey !== originalBoardName;
            });

            if (existingBoard) {
                alert('A board with this ID already exists. Please choose a different ID.');
                return;
            }

            removeBoard(originalBoardName);
            addBoard(String(formData.board_id), formData);
        } else {
            updateBoard(boardName, 'board_id', String(formData.board_id));
            updateBoard(boardName, 'board_ip', formData.board_ip);
        }

        setSelectedSection('general_info');
    };

    useEffect(() => {
        setFilteredMeasurements(boardInfo.measurements.filter(measurement => 
            measurement.name.toLowerCase().includes(measurementSearch.toLowerCase()) ||
            measurement.id.toLowerCase().includes(measurementSearch.toLowerCase())
        ));
    }, [measurementSearch, boardInfo.measurements]);

    useEffect(() => {
        setFilteredPackets(boardInfo.packets.filter(packet => 
            packet.name.toLowerCase().includes(packetSearch.toLowerCase()) ||
            packet.id.toLowerCase().includes(packetSearch.toLowerCase())
        ));
    }, [packetSearch, boardInfo.packets]);

    return (
        <div className="flex w-full flex-col">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-2 text-xl font-bold text-zinc-600">Board ID</h2>
                <Input
                    object={formData}
                    field={'board_id'}
                    setObject={(field, value) => handleBoardUpdate(field, value)}
                    className='w-[30rem]'
                />

                <h2 className="mt-4 mb-2 text-xl font-bold text-zinc-600">
                    Board IP
                </h2>
                <Input
                    object={formData}
                    field={'board_ip'}
                    setObject={(field, value) => handleBoardUpdate(field, value)}
                    className='w-[30rem]'
                />

                <button
                    type="submit"
                    className="bg-hupv-orange/90 hover:bg-hupv-orange mt-4 w-fit cursor-pointer rounded-lg px-4 py-2 text-white"
                >
                    Save Changes
                </button>
            </form>

            <div className="flex gap-4 mt-8 mb-4 items-center">
                <h2 className="text-xl font-bold text-zinc-600">
                    Packets
                </h2>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-hupv-blue hover:bg-hupv-blue/80 w-fit cursor-pointer rounded-lg px-2 py-1 text-white"
                        onClick={() => {
                            setSelectedPacket({
                                id: '',
                                name: '',
                                type: '',
                                variables: []
                            });
                            setIsPacketModalOpen(true);
                        }}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
            <input
                type="text"
                placeholder="Search by name or ID"
                className="w-[30rem] mb-4 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-600 focus:border-hupv-blue focus:outline-none"
                onChange={(e) => setPacketSearch(e.target.value)}
            />
            <ul className="flex flex-wrap gap-4">
                {filteredPackets.map((packet) => (
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

            <input
                type="text"
                placeholder="Search by name or ID"
                className="w-[30rem] mb-4 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-600 focus:border-hupv-blue focus:outline-none"
                onChange={(e) => setMeasurementSearch(e.target.value)}
            />

            <div className="flex flex-col gap-4">
                <ul className="flex flex-wrap gap-4">
                    {filteredMeasurements.map((measurement) => (
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
                onClose={() => {
                    setIsPacketModalOpen(false);
                    setFilteredPackets(boardInfo.packets.filter(packet => 
                        packet.name.toLowerCase().includes(packetSearch.toLowerCase()) ||
                        packet.id.toLowerCase().includes(packetSearch.toLowerCase())
                    ));
                }}
            >
                {selectedPacket && (
                    <PacketForm
                        packet={selectedPacket}
                        boardName={boardName}
                        isCreating={selectedPacket.id === ''}
                        onSubmit={() => {
                            setIsPacketModalOpen(false);
                            setFilteredPackets(boardInfo.packets.filter(packet => 
                                packet.name.toLowerCase().includes(packetSearch.toLowerCase()) ||
                                packet.id.toLowerCase().includes(packetSearch.toLowerCase())
                            ));
                        }}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isMeasurementModalOpen}
                onClose={() => {
                    setIsMeasurementModalOpen(false);
                }}
            >
                {selectedMeasurement && (
                    <MeasurementForm
                        boardName={boardName}
                        measurement={selectedMeasurement}
                        isCreating={selectedMeasurement.id === ''}
                        onSubmit={() => {
                            setIsMeasurementModalOpen(false);
                            setFilteredMeasurements(boardInfo.measurements.filter(measurement => 
                                measurement.name.toLowerCase().includes(measurementSearch.toLowerCase()) ||
                                measurement.id.toLowerCase().includes(measurementSearch.toLowerCase())
                            ));
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};
