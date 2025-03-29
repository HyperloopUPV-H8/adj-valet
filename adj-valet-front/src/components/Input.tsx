interface InputProps<T extends Record<string, unknown>> {
    object: T;
    field: keyof T;
    setObject: (field: keyof T, value: string) => void;
    label?: string;
}

function getNestedValue<T extends Record<string, unknown>>(obj: T, path: string): unknown {
    return path.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj as unknown);
}

export const Input = <T extends Record<string, unknown>>({
    object,
    field,
    setObject,
    label,
}: InputProps<T>) => {
    const fieldPath = String(field);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={fieldPath}>{label}</label>
            <input
                id={fieldPath}
                type="text"
                value={String(getNestedValue(object, fieldPath)) || ''}
                onChange={(e) => setObject(field, e.target.value)}
                placeholder={label}
                className="border border-gray-300 rounded-lg p-2 my-2"
            />
        </div>
    );
};
