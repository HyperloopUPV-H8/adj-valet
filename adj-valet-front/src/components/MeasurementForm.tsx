import { Board, BoardName } from '../types/Board';
import { Measurement } from '../types/Measurement';
import { Input } from './Input';
import { useADJActions, useADJState } from '../store/ADJStore';
import { useState } from 'react';

interface Props {
    boardName: BoardName;
    measurement: Measurement;
    isCreating: boolean;
    onSubmit: () => void;
}

export const MeasurementForm = ({
    boardName,
    measurement,
    isCreating,
    onSubmit,
}: Props) => {
    const { config } = useADJState();
    const { updateMeasurement, removeMeasurement, addMeasurement } = useADJActions();
    const [formData, setFormData] = useState<Measurement>({
        ...measurement,
        enumValues: measurement.enumValues || [],
        safeRange: measurement.safeRange || [0, 0],
        warningRange: measurement.warningRange || [0, 0],
        displayUnits: measurement.displayUnits || '',
        podUnits: measurement.podUnits || ''
    });
    const [enumInputValue, setEnumInputValue] = useState(measurement.enumValues?.join(', ') || '');
    const [originalId] = useState(measurement.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Process enum values before validation
        const processedEnumValues = enumInputValue.split(',').map(v => v.trim()).filter(v => v.length > 0);
        const finalFormData = {
            ...formData,
            enumValues: processedEnumValues
        };

        // Validate required fields
        if (!finalFormData.id.trim()) {
            alert('ID cannot be empty');
            return;
        }
        if (!finalFormData.name.trim()) {
            alert('Name cannot be empty');
            return;
        }
        if (!finalFormData.type.trim()) {
            alert('Type cannot be empty');
            return;
        }

        if (!config) {
            alert('Configuration not loaded');
            return;
        }

        const boardIndex = config.boards.findIndex(
            (board: Board) => Object.keys(board)[0] === boardName
        );
        
        if (boardIndex !== -1) {
            const existingMeasurement = config.boards[boardIndex][boardName].measurements.find(
                (m: Measurement) => m.id === finalFormData.id && m.id !== originalId
            );

            if (existingMeasurement) {
                alert('A measurement with this ID already exists. Please choose a different ID.');
                return;
            }
        }

        if (isCreating) {
            addMeasurement(boardName, finalFormData);
        } else {
            if (originalId !== finalFormData.id) {
                removeMeasurement(boardName, originalId);
                addMeasurement(boardName, finalFormData);
            } else {
                updateMeasurement(boardName, measurement.id, 'id', finalFormData.id);
                updateMeasurement(boardName, measurement.id, 'name', finalFormData.name);
                updateMeasurement(boardName, measurement.id, 'type', finalFormData.type);
                updateMeasurement(
                    boardName,
                    measurement.id,
                    'displayUnits',
                    finalFormData.displayUnits,
                );
                updateMeasurement(
                    boardName,
                    measurement.id,
                    'podUnits',
                    finalFormData.podUnits,
                );
                updateMeasurement(
                    boardName,
                    measurement.id,
                    'enumValues',
                    finalFormData.enumValues,
                );
                updateMeasurement(
                    boardName,
                    measurement.id,
                    'safeRange',
                    finalFormData.safeRange,
                );
                updateMeasurement(
                    boardName,
                    measurement.id,
                    'warningRange',
                    finalFormData.warningRange,
                );
            }
        }
        onSubmit();
    };

    const updateFormField = (
        section: keyof Measurement | 'safeRange' | 'warningRange',
        field: string,
        value: string | string[],
    ) => {
        setFormData((prev) => {
            if (section === 'safeRange' || section === 'warningRange') {
                const currentRange = prev[section] || [0, 0];
                const newRange = [...currentRange];
                const index = parseInt(field);
                newRange[index] = parseFloat(value as string) || 0;
                return {
                    ...prev,
                    [section]: newRange as [number, number],
                };
            }
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    return (
        <div>
            <div className="flex flex-col rounded-xl p-4">
                <form onSubmit={handleSubmit}>
                    <Input
                        object={formData}
                        field={'id'}
                        setObject={(field, value) =>
                            updateFormField('id', field, value)
                        }
                        label="ID"
                    />

                    <Input
                        object={formData}
                        field={'name'}
                        setObject={(field, value) =>
                            updateFormField('name', field, value)
                        }
                        label="Name"
                    />

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => updateFormField('type', 'type', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="float32">float32</option>
                            <option value="float64">float64</option>
                            <option value="uint16">uint16</option>
                            <option value="uint32">uint32</option>
                            <option value="bool">bool</option>
                            <option value="enum">enum</option>
                        </select>
                    </div>

                    <Input
                        object={formData}
                        field={'displayUnits'}
                        setObject={(field, value) =>
                            updateFormField('displayUnits', field, value)
                        }
                        label="Display Units"
                    />

                    <Input
                        object={formData}
                        field={'podUnits'}
                        setObject={(field, value) =>
                            updateFormField('podUnits', field, value)
                        }
                        label="Pod Units"
                    />

                    {formData.type === 'enum' && (
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enum Values (comma-separated)</label>
                            <input
                                type="text"
                                value={enumInputValue}
                                onChange={(e) => setEnumInputValue(e.target.value)}
                                onBlur={(e) => {
                                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v.length > 0);
                                    updateFormField('enumValues', 'enumValues', values);
                                }}
                                placeholder="Value1, Value2, Value3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    )}
                    <div className="flex w-full gap-4">
                        <Input
                            object={{safeMin: formData.safeRange?.[0] || 0}}
                            field={'safeMin'}
                            setObject={(_, value) =>
                                updateFormField('safeRange', '0', value)
                            }
                            label="Safe Range Min"
                            className='flex-1'
                        />

                        <Input
                            object={{safeMax: formData.safeRange?.[1] || 0}}
                            field={'safeMax'}
                            setObject={(_, value) =>
                                updateFormField('safeRange', '1', value)
                            }
                            label="Safe Range Max"
                            className='flex-1'
                        />
                    </div>

                    <div className="flex w-full gap-4">
                        <Input
                            object={{warningMin: formData.warningRange?.[0] || 0}}
                            field={'warningMin'}
                            setObject={(_, value) =>
                                updateFormField('warningRange', '0', value)
                            }
                            label="Warning Range Min"
                            className='flex-1'
                        />

                        <Input
                            object={{warningMax: formData.warningRange?.[1] || 0}}
                            field={'warningMax'}
                            setObject={(_, value) =>
                                updateFormField('warningRange', '1', value)
                            }
                            label="Warning Range Max"
                            className='flex-1'
                        />
                    </div>

                    <div className='flex gap-4'>
                        {!isCreating && (
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 mt-4 w-fit cursor-pointer rounded-lg px-4 py-2 text-white"
                                onClick={() => {
                                    removeMeasurement(boardName, measurement.id)
                                    onSubmit()
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-hupv-orange/80 hover:bg-hupv-orange mt-4 w-full cursor-pointer rounded-lg px-4 py-2 text-white"
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
