import { Button } from '../components/Button';
import { useADJStore } from '../store/ADJStore';

interface Props {
    selectedSection: string;
    onSelectedSection: (section: string) => void;
}

export const Sidebar = ({ selectedSection, onSelectedSection }: Props) => {
    const { boards } = useADJStore();

    const clearADJPath = () => {
        localStorage.removeItem('adj_path');
        window.location.reload();
    } 

    return (
        <section className="bg-hupv-blue shadow-large flex h-full w-sm flex-col gap-4 p-4">
            <button className="bg-hupv-orange align-center flex w-fit cursor-pointer justify-center self-end rounded-full p-2 text-white" onClick={() => clearADJPath()}>
                <i className="fa-solid fa-gear text-2xl"></i>
            </button>

            <Button
                title="General Info"
                isSelected={selectedSection == 'general_info'}
                onClick={() => onSelectedSection('general_info')}
            />

            <div>
                <h2 className="mb-1 text-2xl font-bold text-white">
                    Boards
                    <hr className="mb-4 text-white" />
                </h2>

                <ul className="mx-auto flex w-[90%] flex-col gap-4">
                    {boards.map((board, index) => {
                        const name = Object.keys(board)[0];
                        return (
                            <li key={index} className="shadow-small">
                                <Button
                                    title={name}
                                    isSelected={selectedSection == name}
                                    onClick={() => onSelectedSection(name)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};
