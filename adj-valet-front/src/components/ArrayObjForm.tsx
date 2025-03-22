import { useADJStore } from '../store/ADJStore';

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

    const handleChange = (
        oldKey: string,
        field: 'key' | 'value',
        value: string,
    ) => {
        if (field === 'key') {
            updateGeneralInfoField(
                sectionName,
                oldKey,
                value,
                general_info[oldKey],
            );
        } else {
            updateGeneralInfoField(sectionName, oldKey, oldKey, value);
        }
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
                        value={key}
                        onChange={(e) =>
                            handleChange(key, 'key', e.target.value)
                        }
                        className="border p-2"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handleChange(key, 'value', e.target.value)
                        }
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
                Añadir campo
            </button>
        </div>
    );
};
