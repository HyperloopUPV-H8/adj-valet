interface InputProps<T> {
    object: T;
    field: keyof T;
    setObject: (field: keyof T, value: string) => void;
    placeholder?: string;
}

export const Input = <T,>({
    object,
    field,
    setObject,
    placeholder,
}: InputProps<T>) => {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={String(field)}>{String(field)}</label>
            <input
                id={String(field)}
                type="text"
                value={String(object[field]) || ''}
                onChange={(e) => setObject(field, e.target.value)}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg p-2 my-2"
            />
        </div>
    );
};
