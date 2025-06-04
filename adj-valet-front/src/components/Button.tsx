
interface Props {
    title: string | React.ReactNode;
    isSelected?: boolean;
    onClick?: () => void;
}  

export const Button = ({ title, isSelected, onClick }: Props) => (
    <div
        className="h-12 w-full cursor-pointer rounded-2xl bg-white"
        onClick={onClick}
    >
        <div className="flex h-full items-center gap-2 px-4">
            {isSelected && (
                <i className="fa-solid fa-caret-right text-orange-500"></i>
            )}
            <div
                className={`text-lg font-semibold ${isSelected ? 'text-orange-500' : 'text-blue-900'}`}
            >
                {title}
            </div>
        </div>
    </div>
);
