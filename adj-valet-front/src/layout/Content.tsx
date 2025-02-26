import { useContext } from "react";
import ADJContext from "../context/ADJContext";
import { BoardForm } from "../components/BoardForm";

interface Props {
    selectedSection: string;
}

export const Content = ({ selectedSection }: Props) => {

    const ADJInfo = useContext(ADJContext);

    const result = ADJInfo?.boards.find(board => Object.keys(board)[0] === selectedSection)
    const result2 = result ? Object.values(result)[0] : undefined;

    const content = selectedSection === 'general_info' ? (
        <div>General Info</div>
    ) : (
        <BoardForm board={result2}/>
    )

    return content;
};

