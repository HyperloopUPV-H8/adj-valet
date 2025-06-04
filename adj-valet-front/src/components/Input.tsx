interface InputProps<T extends Record<string, unknown>> {
    object: T;
    field: keyof T;
    setObject: (field: keyof T, value: string) => void;
    label?: string;
    className?: string;
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
    className,
}: InputProps<T>) => {
    const fieldPath = String(field);

    return (
        <div className={`flex flex-col gap-1 min-w-0 ${className || ''}`}>
            {label && (
                <label htmlFor={fieldPath} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={fieldPath}
                type="text"
                value={String(getNestedValue(object, fieldPath)) || ''}
                onChange={(e) => setObject(field, e.target.value)}
                placeholder={label}
                className="w-full min-w-0 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
        </div>
    );
};
