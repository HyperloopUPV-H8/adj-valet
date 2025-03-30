import { BoardName } from '../types/Board';
import { Measurement } from '../types/Measurement';
import { Input } from './Input';
import { useADJStore } from '../store/ADJStore';
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
    const { updateMeasurement, updateRange, addMeasurement, removeMeasurement } = useADJStore();

    const [formData, setFormData] = useState<Measurement>(measurement);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreating) {
            if (!formData.id.trim()) {
                alert('ID cannot be empty');
                return;
            }
            if (!formData.name.trim()) {
                alert('Name cannot be empty');
                return;
            }
            if (!formData.type.trim()) {
                alert('Type cannot be empty');
                return;
            }
            addMeasurement(boardName, formData);
        } else {
            updateMeasurement(boardName, measurement.id, 'id', formData.id);
            updateMeasurement(boardName, measurement.id, 'name', formData.name);
            updateMeasurement(boardName, measurement.id, 'type', formData.type);
            updateMeasurement(
                boardName,
                measurement.id,
                'displayUnits',
                formData.displayUnits,
            );
            updateMeasurement(
                boardName,
                measurement.id,
                'podUnits',
                formData.podUnits,
            );
            updateMeasurement(
                boardName,
                measurement.id,
                'enumValues',
                formData.enumValues,
            );
            updateRange(
                boardName,
                measurement.id,
                'above',
                'safe',
                String(formData.above.safe),
            );
            updateRange(
                boardName,
                measurement.id,
                'above',
                'warning',
                String(formData.above.warning),
            );
            updateRange(
                boardName,
                measurement.id,
                'below',
                'safe',
                String(formData.below.safe),
            );
            updateRange(
                boardName,
                measurement.id,
                'below',
                'warning',
                String(formData.below.warning),
            );
        }
        onSubmit();
    };

    const updateFormField = (
        section: keyof Measurement | 'above' | 'below',
        field: string,
        value: string | string[],
    ) => {
        setFormData((prev) => {
            if (section === 'above' || section === 'below') {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value,
                    },
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

                    <Input
                        object={formData}
                        field={'type'}
                        setObject={(field, value) =>
                            updateFormField('type', field, value)
                        }
                        label="Type"
                    />

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

                    <div className="mb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Enum Values ({formData.enumValues.length})
                            </label>
                        </div>

                        <details className="rounded-lg">
                            <summary className="cursor-pointer">
                                Show/Hide Enum Values
                            </summary>
                            <div className="mt-3 space-y-2">
                                {formData.enumValues.map((value, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newValues = [
                                                    ...formData.enumValues,
                                                ];
                                                newValues[index] =
                                                    e.target.value;
                                                updateFormField(
                                                    'enumValues',
                                                    'enumValues',
                                                    newValues,
                                                );
                                            }}
                                            className="block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newValues =
                                                    formData.enumValues.filter(
                                                        (_, i) => i !== index,
                                                    );
                                                updateFormField(
                                                    'enumValues',
                                                    'enumValues',
                                                    newValues,
                                                );
                                            }}
                                            className="cursor-pointer rounded-lg bg-red-500 px-3 text-white hover:bg-red-600"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newValues = [
                                        ...formData.enumValues,
                                        '',
                                    ];
                                    updateFormField(
                                        'enumValues',
                                        'enumValues',
                                        newValues,
                                    );
                                }}
                                className="mt-4 cursor-pointer rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </details>
                    </div>
                    <div className="flex w-full gap-4">
                        <Input
                            object={formData.above}
                            field={'safe'}
                            setObject={(field, value) =>
                                updateFormField('above', field, value)
                            }
                            label="Above Safe"
                            className='flex-1'
                        />

                        <Input
                            object={formData.below}
                            field={'safe'}
                            setObject={(field, value) =>
                                updateFormField('below', field, value)
                            }
                            label="Below Safe"
                            className='flex-1'
                        />
                    </div>

                    <div className="flex w-full gap-4">
                        <Input
                            object={formData.above}
                            field={'warning'}
                            setObject={(field, value) =>
                                updateFormField('above', field, value)
                            }
                            label="Above Warning"
                            className='flex-1'
                        />

                        <Input
                            object={formData.below}
                            field={'warning'}
                            setObject={(field, value) =>
                                updateFormField('below', field, value)
                            }
                            label="Below Warning"
                            className='flex-1'
                        />
                    </div>

                    <div className='flex gap-4'>
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
