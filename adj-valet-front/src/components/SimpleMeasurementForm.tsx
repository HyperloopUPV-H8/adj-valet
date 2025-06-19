import { useState } from 'react';
import { useADJActions } from '../store/ADJStore';
import { Measurement } from '../types/Measurement';
import { BoardName } from '../types/Board';

interface Props {
    boardName: BoardName;
    measurement: Measurement;
    isCreating: boolean;
    onSubmit: () => void;
}

export const SimpleMeasurementForm = ({ boardName, measurement, isCreating, onSubmit }: Props) => {
    const { addMeasurement, updateMeasurement, removeMeasurement } = useADJActions();
    const [formData, setFormData] = useState<Measurement>(measurement);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id.trim()) {
            alert('ID cannot be empty');
            return;
        }

        if (!formData.name.trim()) {
            alert('Name cannot be empty');
            return;
        }

        if (isCreating) {
            addMeasurement(boardName, formData);
        } else {
            // Update each field
            Object.keys(formData).forEach(key => {
                updateMeasurement(boardName, measurement.id, key as keyof Measurement, formData[key as keyof Measurement]);
            });
        }

        onSubmit();
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete measurement "${measurement.name}"?`)) {
            removeMeasurement(boardName, measurement.id);
            onSubmit();
        }
    };

    const handleFieldChange = (field: keyof Measurement, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRangeChange = (rangeType: 'safeRange' | 'warningRange', index: 0 | 1, value: string) => {
        const numValue = parseFloat(value) || 0;
        setFormData(prev => {
            const currentRange = prev[rangeType] || [0, 0];
            return {
                ...prev,
                [rangeType]: index === 0 
                    ? [numValue, currentRange[1]] 
                    : [currentRange[0], numValue]
            };
        });
    };

    const handleEnumValuesChange = (value: string) => {
        const values = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        setFormData(prev => ({ ...prev, enumValues: values }));
    };

    return (
        <div className="p-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0 pr-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isCreating ? 'Add New Measurement' : `Edit Measurement: ${measurement.name}`}
                </h2>
                {!isCreating && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                        <input
                            type="text"
                            value={formData.id}
                            onChange={(e) => handleFieldChange('id', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleFieldChange('type', e.target.value)}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pod Units</label>
                        <input
                            type="text"
                            value={formData.podUnits}
                            onChange={(e) => handleFieldChange('podUnits', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Units</label>
                        <input
                            type="text"
                            value={formData.displayUnits}
                            onChange={(e) => handleFieldChange('displayUnits', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>

                {formData.type === 'enum' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enum Values (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.enumValues?.join(', ') || ''}
                            onChange={(e) => handleEnumValuesChange(e.target.value)}
                            placeholder="Value1, Value2, Value3"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Safe Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.safeRange?.[0] || ''}
                                    onChange={(e) => handleRangeChange('safeRange', 0, e.target.value)}
                                    placeholder="Min"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <span className="text-xs text-gray-500 mt-1 block">Minimum</span>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.safeRange?.[1] || ''}
                                    onChange={(e) => handleRangeChange('safeRange', 1, e.target.value)}
                                    placeholder="Max"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <span className="text-xs text-gray-500 mt-1 block">Maximum</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warning Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.warningRange?.[0] || ''}
                                    onChange={(e) => handleRangeChange('warningRange', 0, e.target.value)}
                                    placeholder="Min"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <span className="text-xs text-gray-500 mt-1 block">Minimum</span>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.warningRange?.[1] || ''}
                                    onChange={(e) => handleRangeChange('warningRange', 1, e.target.value)}
                                    placeholder="Max"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <span className="text-xs text-gray-500 mt-1 block">Maximum</span>
                            </div>
                        </div>
                    </div>
                </div>

            </form>

            <div className="flex justify-end gap-3 pt-4 border-t bg-white flex-shrink-0">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    {isCreating ? 'Add Measurement' : 'Update Measurement'}
                </button>
            </div>
        </div>
    );
};