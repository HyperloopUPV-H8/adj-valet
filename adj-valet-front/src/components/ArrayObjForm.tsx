import { useADJStore } from '../store/ADJStore';
import { useState } from 'react';

interface Props {
    sectionName: string;
}

export const ArrayObjForm = ({ sectionName }: Props) => {
    const {
        general_info,
        updateGeneralInfoField,
        addGeneralInfoField,
        removeGeneralInfoField,
    } = useADJStore();

    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

    const handleKeyChange = (oldKey: string, newKey: string) => {
        setEditingKeys({
            ...editingKeys,
            [oldKey]: newKey
        });
    };

    const handleKeyBlur = (oldKey: string) => {
        const newKey = editingKeys[oldKey];
        if (newKey && newKey !== oldKey) {
            updateGeneralInfoField(
                sectionName,
                oldKey,
                newKey,
                (general_info[sectionName] as Record<string, string>)[oldKey]
            );
            setEditingKeys(prev => {
                const updated = {...prev};
                delete updated[oldKey];
                return updated;
            });
        }
    };

    const handleValueChange = (key: string, value: string) => {
        updateGeneralInfoField(sectionName, key, key, value);
    };

    return (
        <div className="max-w-full">
            <h2 className="mb-4 text-xl font-bold">{sectionName}</h2>

            {Object.entries(
                general_info[sectionName] as Record<string, string>,
            ).map(([key, value]) => (
                <div key={key} className="mb-2 flex gap-2">
                    <input
                        type="text"
                        value={editingKeys[key] ?? key}
                        onChange={(e) => handleKeyChange(key, e.target.value)}
                        onBlur={() => handleKeyBlur(key)}
                        className="border p-2"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleValueChange(key, e.target.value)}
                        className="border p-2"
                    />
                    <button
                        onClick={() => removeGeneralInfoField(sectionName, key)}
                        className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ))}

            <button
                onClick={() => addGeneralInfoField(sectionName)}
                className="bg-hupv-blue mt-2 cursor-pointer rounded-xl px-4 py-2 text-white"
            >
                Add field
            </button>
        </div>
    );
};
