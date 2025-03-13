interface InputProps<T> {
    object: T;
    field: keyof T;
    setObject: (field: keyof T, value: string) => void;
    placeholder?: string;
}

function getNestedValue<T>(obj: T, path: string): unknown {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const Input = <T,>({
    object,
    field,
    setObject,
    placeholder,
}: InputProps<T>) => {
    const fieldPath = String(field);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={fieldPath}>{fieldPath}</label>
            <input
                id={fieldPath}
                type="text"
                value={String(getNestedValue(object, fieldPath)) || ''}
                onChange={(e) => setObject(field, e.target.value)}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg p-2 my-2"
            />
        </div>
    );
};
