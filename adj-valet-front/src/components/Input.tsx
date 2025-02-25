interface Props {
    label: string,
}

export const Input = ({
    label,
}: Props) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-400">{ label }</label>
            <input type="text" className="w-1/2 h-12 px-4 rounded-2xl border border-gray-400 focus:outline-none focus:border-2 focus:border-hupv-orange"/>
        </div>
    )
}
