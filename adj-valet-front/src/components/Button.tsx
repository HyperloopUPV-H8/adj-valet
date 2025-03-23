
interface Props {
    title: string;
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
                <i className="fa-solid fa-caret-right text-hupv-orange"></i>
            )}
            <p
                className={`text-lg font-semibold ${isSelected ? 'text-hupv-orange' : 'text-hupv-blue'}`}
            >
                {title}
            </p>
        </div>
    </div>
);
