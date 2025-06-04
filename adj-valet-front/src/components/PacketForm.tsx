import { useState } from 'react';
import { useADJActions } from '../store/ADJStore';
import { Packet } from '../types/Packet';
import { Measurement } from '../types/Measurement';
import { Input } from './Input';
interface Props {
    boardName: string;
    packet: Packet;
    onSubmit: () => void;
    isCreating: boolean;
}

export const PacketForm = ({ boardName, packet, onSubmit, isCreating }: Props) => {
    // const { config } = useADJState();
    const { removePacket, addPacket } = useADJActions();
    const [formData, setFormData] = useState(packet);
    const [searchTerm, setSearchTerm] = useState('');
    const [originalId] = useState(packet.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id.trim()) {
            alert('El ID no puede estar vacío');
            return;
        }

        if (!formData.name.trim()) {
            alert('El nombre no puede estar vacío'); 
            return;
        }

        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName
        );
        const existingPacket = boards[boardIndex][boardName].packets.find(
            p => p.id === formData.id && p.id !== originalId
        );

        if (existingPacket) {
            alert('A packet with this ID already exists. Please choose a different ID.');
            return;
        }

        if (isCreating) {
            addPacket(boardName, formData);
        } else {
            if (originalId !== formData.id) {
                removePacket(boardName, originalId);
                addPacket(boardName, formData);
            } else {
                updatePacketField(boardName, packet.id, 'id', formData.id);
                updatePacketField(boardName, packet.id, 'name', formData.name);
                updatePacketField(boardName, packet.id, 'type', formData.type);
                updatePacketField(
                    boardName,
                    packet.id,
                    'variables',
                    formData.variables
                );
            }
        }
        onSubmit();
    };

    const updateFormField = (field: keyof Packet, value: string | string[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div>
            <div className="flex flex-col rounded-xl p-4">
                <form onSubmit={handleSubmit}>
                    <Input
                        object={formData}
                        field={'id'}
                        setObject={(field, value) =>
                            updateFormField(field, value)
                        }
                        label="ID"
                    />

                    <Input
                        object={formData}
                        field={'name'}
                        setObject={(field, value) =>
                            updateFormField(field, value)
                        }
                        label="Name"
                    />

                    <Input
                        object={formData}
                        field={'type'}
                        setObject={(field, value) =>
                            updateFormField(field, value)
                        }
                        label="Type"
                    />

                    <div className="flex gap-4">
                        <div className="mt-4 flex-1">
                            <label className="text-zinc-600">Packet Measurements</label>
                            <ul className="mt-2 flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                                {formData.variables.map((variable, index) => (
                                    <li 
                                        key={index}
                                        className="flex items-center justify-between rounded-lg bg-hupv-blue/90 px-3 py-2 text-white"
                                    >
                                        <span>{variable}</span>
                                        <i
                                            className="fa-solid fa-xmark cursor-pointer text-white hover:text-red-400"
                                            onClick={() => {
                                                const newVariables = formData.variables.filter((_, i) => i !== index);
                                                updateFormField('variables', newVariables);
                                            }}
                                        ></i>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 flex-1">
                            <label className="text-zinc-600">Board Measurements</label>
                            <div className="mt-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-600 focus:border-hupv-blue focus:outline-none"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                                {boards.find(b => Object.keys(b)[0] === boardName)?.[boardName].measurements
                                    .filter(measurement => !formData.variables.includes(measurement.name))
                                    .filter(measurement => 
                                        measurement.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
                                    )
                                    .map((measurement: Measurement, index: number) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between rounded-lg bg-hupv-blue/70 px-3 py-2 text-white"
                                        >
                                            <span>{measurement.name}</span>
                                            <i
                                                className="fa-solid fa-plus cursor-pointer text-white hover:text-green-400"
                                                onClick={() => {
                                                    updateFormField('variables', [...formData.variables, measurement.name]);
                                                }}
                                            ></i>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        {!isCreating && (
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 mt-4 w-fit cursor-pointer rounded-lg px-4 py-2 text-white"
                                onClick={() => {
                                    removePacket(boardName, packet.id)
                                    onSubmit()
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-hupv-orange/90 hover:bg-hupv-orange mt-4 w-full cursor-pointer rounded-lg px-4 py-2 text-white"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
