import { useADJState, useADJActions } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { SimpleMeasurementForm } from './SimpleMeasurementForm';
import { SimplePacketForm } from './SimplePacketForm';
import { Measurement } from '../types/Measurement';
import { Packet } from '../types/Packet';

interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
    setSelectedSection: (section: string) => void;
}

export const SimpleBoardForm = ({ boardName, boardInfo }: Props) => {
    const { config } = useADJState();
    const { updateBoard } = useADJActions();
    const [localBoardInfo, setLocalBoardInfo] = useState(boardInfo);
    
    // Modal states
    const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
    const [isPacketModalOpen, setIsPacketModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

    // Update local board info when the store changes
    useEffect(() => {
        setLocalBoardInfo(boardInfo);
    }, [boardInfo]);

    if (!config) {
        return <div>No configuration loaded</div>;
    }

    const handleUpdate = (field: keyof BoardInfo, value: string | number) => {
        const newValue = field === 'board_id' ? Number(value) : value;
        setLocalBoardInfo(prev => ({ ...prev, [field]: newValue }));
        updateBoard(boardName, field, newValue);
    };

    const handleMeasurementClick = (measurement: Measurement) => {
        setSelectedMeasurement(measurement);
        setIsMeasurementModalOpen(true);
    };

    const handlePacketClick = (packet: Packet) => {
        setSelectedPacket(packet);
        setIsPacketModalOpen(true);
    };

    const handleAddMeasurement = () => {
        const newMeasurement: Measurement = {
            id: `measurement_${Date.now()}`,
            name: 'New Measurement',
            type: 'Analog',
            podUnits: 'units',
            displayUnits: 'units',
            enumValues: [],
            safeRange: [0, 100],
            warningRange: [0, 100]
        };
        setSelectedMeasurement(newMeasurement);
        setIsMeasurementModalOpen(true);
    };

    const handleAddPacket = () => {
        const newPacket: Packet = {
            id: Date.now(),
            type: 'DATA',
            name: 'New Packet',
            variables: []
        };
        setSelectedPacket(newPacket);
        setIsPacketModalOpen(true);
    };

    const closeModals = () => {
        setIsMeasurementModalOpen(false);
        setIsPacketModalOpen(false);
        setSelectedMeasurement(null);
        setSelectedPacket(null);
    };

    return (
        <div className="w-full p-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Board: {boardName}</h1>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Board ID
                        </label>
                        <input
                            type="number"
                            value={localBoardInfo.board_id}
                            onChange={(e) => handleUpdate('board_id', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Board IP
                        </label>
                        <input
                            type="text"
                            value={localBoardInfo.board_ip}
                            onChange={(e) => handleUpdate('board_ip', e.target.value)}
                            placeholder="192.168.1.100"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Measurements</h3>
                            <button
                                onClick={handleAddMeasurement}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                                Add Measurement
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-md p-4">
                            {localBoardInfo.measurements.length > 0 ? (
                                <div className="space-y-2">
                                    {localBoardInfo.measurements.map((measurement, index) => (
                                        <div 
                                            key={index} 
                                            className="flex justify-between items-center bg-white p-3 rounded cursor-pointer hover:bg-blue-50 transition-colors border"
                                            onClick={() => handleMeasurementClick(measurement)}
                                        >
                                            <span className="font-medium text-blue-800">{measurement.name}</span>
                                            <span className="text-sm text-gray-500">ID: {measurement.id}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No measurements configured</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Packets</h3>
                            <button
                                onClick={handleAddPacket}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                                Add Packet
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-md p-4">
                            {localBoardInfo.packets.length > 0 ? (
                                <div className="space-y-2">
                                    {localBoardInfo.packets.map((packet, index) => (
                                        <div 
                                            key={index} 
                                            className="flex justify-between items-center bg-white p-3 rounded cursor-pointer hover:bg-green-50 transition-colors border"
                                            onClick={() => handlePacketClick(packet)}
                                        >
                                            <span className="font-medium text-green-800">{packet.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {packet.id ? `ID: ${packet.id}` : 'No ID'} | Type: {packet.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No packets configured</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Measurement Modal */}
            <Modal isOpen={isMeasurementModalOpen} onClose={closeModals}>
                {selectedMeasurement && (
                    <SimpleMeasurementForm
                        boardName={boardName}
                        measurement={selectedMeasurement}
                        isCreating={!localBoardInfo.measurements.some(m => m.id === selectedMeasurement.id)}
                        onSubmit={closeModals}
                    />
                )}
            </Modal>

            {/* Packet Modal */}
            <Modal isOpen={isPacketModalOpen} onClose={closeModals}>
                {selectedPacket && (
                    <SimplePacketForm
                        boardName={boardName}
                        packet={selectedPacket}
                        isCreating={!localBoardInfo.packets.some(p => 
                            (p.id && selectedPacket.id && p.id === selectedPacket.id) || 
                            (!p.id && !selectedPacket.id && p.name === selectedPacket.name)
                        )}
                        onSubmit={closeModals}
                    />
                )}
            </Modal>
        </div>
    );
};