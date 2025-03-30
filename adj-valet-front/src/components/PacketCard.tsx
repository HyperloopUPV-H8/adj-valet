
interface Props {
    packetId: string;
    packetName: string;
    onSelect: () => void;
}

export const PacketCard = ({ packetId, packetName, onSelect }: Props) => {
    return (
        <div onClick={onSelect} className="cursor-pointer rounded-lg bg-hupv-blue/40 p-4 shadow-md hover:bg-hupv-orange/90 transition-colors mb-4">
            <div className="flex items-center justify-between">
                <div className="text-lg font-medium text-gray-900">{packetName}</div>
                <div className="text-sm text-gray-500">ID: {packetId}</div>
            </div>
        </div>
    );
};
