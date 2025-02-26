import { useEffect, useState } from 'react';

interface Props {
    label: string;
    value?: string;
}

export const Input = ({ label, value = '' }: Props) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className="flex flex-col">
            <label className="text-gray-400">{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="focus:border-hupv-orange h-12 w-fit rounded-2xl border border-gray-400 px-4 focus:border-2 focus:outline-none"
            />
        </div>
    );
};
