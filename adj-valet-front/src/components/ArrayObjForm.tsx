import { useADJState, useADJActions } from '../store/ADJStore';
import { useState } from 'react';

interface Props {
    sectionName: string;
}

export const ArrayObjForm = ({ sectionName }: Props) => {
    const { config } = useADJState();
    const {
        updateGeneralInfo,
        addGeneralInfoField,
        removeGeneralInfoField,
    } = useADJActions();

    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

    if (!config?.general_info) {
        return <div>No configuration available</div>;
    }

    const handleKeyChange = (oldKey: string, newKey: string) => {
        setEditingKeys({
            ...editingKeys,
            [oldKey]: newKey
        });
    };

    const handleKeyBlur = (oldKey: string) => {
        const newKey = editingKeys[oldKey];
        if (newKey && newKey !== oldKey && config?.general_info) {
            const currentValue = (config.general_info[sectionName] as Record<string, unknown>)[oldKey];
            // First remove the old key
            removeGeneralInfoField(sectionName, oldKey);
            // Then add the new key with the old value
            updateGeneralInfo(sectionName, newKey, currentValue);
            
            setEditingKeys(prev => {
                const updated = {...prev};
                delete updated[oldKey];
                return updated;
            });
        }
    };

    const handleValueChange = (key: string, value: string) => {
        updateGeneralInfo(sectionName, key, value);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 min-w-80">
            <h2 className="mb-6 text-xl font-bold text-gray-800 capitalize">{sectionName.replace(/_/g, ' ')}</h2>

            <div className="space-y-3">
                {Object.entries(
                    config.general_info[sectionName] as Record<string, unknown>,
                ).map(([key, value]) => (
                    <div key={key} className="flex gap-2 items-center min-w-0">
                        <input
                            type="text"
                            value={editingKeys[key] ?? key}
                            onChange={(e) => handleKeyChange(key, e.target.value)}
                            onBlur={() => handleKeyBlur(key)}
                            className="flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                            placeholder="Field name"
                        />
                        <input
                            type="text"
                            value={String(value)}
                            onChange={(e) => handleValueChange(key, e.target.value)}
                            className="flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                            placeholder="Value"
                        />
                        <button
                            onClick={() => removeGeneralInfoField(sectionName, key)}
                            className="flex-shrink-0 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                            title="Remove field"
                        >
                            <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => addGeneralInfoField(sectionName)}
                className="bg-blue-600 hover:bg-blue-700 mt-2 cursor-pointer rounded-xl px-4 py-2 text-white transition-colors"
            >
                Add field
            </button>
        </div>
    );
};
