import { useState } from 'react';
import { sendADJ } from '../api/api';
import { Button } from '../components/Button';
import { useADJStore } from '../store/ADJStore';

interface Props {
    selectedSection: string;
    onSelectedSection: (section: string) => void;
}

export const Sidebar = ({ selectedSection, onSelectedSection }: Props) => {
    const { boards, assembleADJ, addBoard } = useADJStore();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const onClearADJPath = () => {
        localStorage.removeItem('adj_path');
        window.location.reload();
    };

    const onSaveADJ = async () => {
        try {
            const adj = assembleADJ();
            await sendADJ(adj);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        } catch (error) {
            setErrorMessage(`${error}`);
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        }
    };

    return (
        <section className="bg-hupv-blue shadow-large flex h-full w-sm flex-col gap-4 p-4">
            {errorMessage && (
                <p className="font-bold text-red-500">{errorMessage}</p>
            )}

            {isSuccess && (
                <p className="font-bold text-green-500">
                    ADJ updated successfully
                </p>
            )}

            <div className="flex gap-2 self-end">
                <button
                    className="align-center flex w-fit cursor-pointer rounded-full bg-green-500 p-2 text-white"
                    onClick={() => onSaveADJ()}
                >
                    <i className="fa-solid fa-floppy-disk text-2xl"></i>
                </button>
                <button
                    className="bg-hupv-orange align-center flex w-fit cursor-pointer rounded-full p-2 text-white"
                    onClick={() => onClearADJPath()}
                >
                    <i className="fa-solid fa-gear text-2xl"></i>
                </button>
            </div>

            <Button
                title="General Info"
                isSelected={selectedSection == 'general_info'}
                onClick={() => onSelectedSection('general_info')}
            />

            <div>
                <h2 className="mb-1 text-2xl font-bold text-white">
                    Boards
                    <hr className="mb-4 text-white" />
                </h2>

                <ul className="mx-auto flex w-[90%] flex-col gap-4">
                    {boards.map((board, index) => {
                        const name = Object.keys(board)[0];
                        return (
                            <li key={index} className="shadow-small">
                                <Button
                                    title={name}
                                    isSelected={selectedSection == name}
                                    onClick={() => onSelectedSection(name)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <button
                className="bg-hupv-orange align-center flex w-fit cursor-pointer self-end rounded-full p-3 text-white"
                onClick={() => {
                    // Find the next available board ID
                    const existingIds = boards.map(board => {
                        const boardInfo = Object.values(board)[0];
                        return Number(boardInfo.board_id);
                    });
                    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
                    
                    // Generate a unique board name
                    let boardName = `Board${nextId}`;
                    let counter = 1;
                    while (boards.some(board => Object.keys(board)[0] === boardName)) {
                        boardName = `Board${nextId}_${counter++}`;
                    }
                    
                    addBoard(boardName, {
                        board_id: nextId,
                        board_ip: '0.0.0.0',
                        packets: [{
                            id: 'default_packet',
                            name: 'Default Packet',
                            type: 'DATA',
                            variables: []
                        }],
                        measurements: [{
                            id: 'default_measurement',
                            name: 'Default Measurement',
                            type: 'uint8',
                            displayUnits: 'units',
                            podUnits: 'units',
                            enumValues: [],
                            above: { safe: 100, warning: 80 },
                            below: { safe: 0, warning: 20 },
                            out_of_range: [0, 100]
                        }],
                    });
                }}
            >
                <i className="fa-solid fa-plus"></i>
            </button>
        </section>
    );
};
