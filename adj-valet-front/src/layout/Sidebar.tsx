import { useContext } from 'react';
import { Button } from '../components/Button';
import ADJContext from '../context/ADJContext';

export const Sidebar = () => {
    const { boards } = useContext(ADJContext) || {};

    return (
        <section className="bg-hupv-blue shadow-large h-full w-sm p-4">
            <h2 className="mb-1 ml-4 text-2xl font-bold text-white">
                General Info
            </h2>
            <hr className="mb-4 text-white" />

            <h2 className="mb-1 ml-4 text-2xl font-bold text-white">Boards</h2>
            <hr className="mb-4 text-white" />

            <ul className="mx-auto flex w-[90%] flex-col gap-4">
                {boards &&
                    boards.map((board, index) => {
                        const name = Object.keys(board)[0];
                        return (
                            <li key={index} className="shadow-small">
                                <Button title={name} isSelected={true} />
                            </li>
                        );
                    })}
            </ul>
        </section>
    );
};
