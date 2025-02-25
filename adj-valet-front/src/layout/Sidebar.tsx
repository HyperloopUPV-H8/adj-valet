import { useContext } from 'react';
import { Button } from '../components/Button';
import ADJContext from '../context/ADJContext';

interface Props {
    selectedSection: string;
    onSelectedSection: (section: string) => void;
}

export const Sidebar = ({ selectedSection, onSelectedSection }: Props) => {
    const { boards } = useContext(ADJContext) || {};

    return (
        <section className="bg-hupv-blue shadow-large flex h-full w-sm flex-col gap-4 p-4">
            <Button title="General Info" isSelected={selectedSection == 'general_info'} onClick={() => onSelectedSection('general_info')}/>

            <div>
                <h2 className="mb-1 text-2xl font-bold text-white">
                    Boards
                    <hr className="mb-4 text-white" />
                </h2>

                <ul className="mx-auto flex w-[90%] flex-col gap-4">
                    {boards &&
                        boards.map((board, index) => {
                            const name = Object.keys(board)[0];
                            return (
                                <li key={index} className="shadow-small">
                                    <Button title={name} isSelected={selectedSection == name} onClick={() => onSelectedSection(name)}/>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </section>
    );
};
