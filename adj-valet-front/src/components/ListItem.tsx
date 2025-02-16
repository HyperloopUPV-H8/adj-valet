
interface Props {
    title: string;
    icon?: string;
}  

export const ListItem = ({ title, icon }: Props) => (
    <div className="h-12 w-full bg-white rounded-2xl cursor-pointer">
        <div className="flex items-center h-full px-4">
            {icon && <img src={icon} alt={title} className="w-6 h-6 mr-4"/>}
            <p className="text-lg font-semibold text-hupv-blue">{title}</p>
        </div>
    </div>
);
