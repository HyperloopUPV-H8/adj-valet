import { useEffect, useState } from "react";

interface Props {
    label: string,
    value?: string
}

export const Input = ({
    label,
    value = ''
}: Props) => {

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className="flex flex-col">
            <label className="text-gray-400">{ label }</label>
            <input type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} className="w-1/2 h-12 w-fit px-4 rounded-2xl border border-gray-400 focus:outline-none focus:border-2 focus:border-hupv-orange"/>
        </div>
    )
}
