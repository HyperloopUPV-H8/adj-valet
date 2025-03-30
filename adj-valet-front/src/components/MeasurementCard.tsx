interface Props {
    measurementName: string;
    measurementId: string;
    onSelect: () => void;
}

export const MeasurementCard = ({ measurementName, measurementId, onSelect }: Props) => {
    return (
        <div
            className={"bg-hupv-blue cursor-pointer rounded-2xl px-4 py-2 text-white"}
            onClick={onSelect}
        >
            <div className="flex items-center justify-between gap-8">
                <div className="text-lg font-medium">{measurementName}</div>
                <div className="text-sm">ID: {measurementId}</div>
            </div>
        </div>
    );
};
