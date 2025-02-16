import { ListItem } from "../components/ListItem";

export const Sidebar = () => (
    <section className="bg-hupv-blue h-full w-sm p-4 shadow-large">

        <h2 className="text-2xl font-bold text-white mb-1 ml-4">Boards</h2>
        <hr className="text-white mb-4"/>

        <ul className="mx-auto w-[90%] flex flex-col gap-4">
            <li className="shadow-small">
                <ListItem
                    title="LCU"
                />
            </li>
            <li className="shadow-small">
                <ListItem
                    title="VCU"
                />
            </li>
        </ul>

    </section>
);
