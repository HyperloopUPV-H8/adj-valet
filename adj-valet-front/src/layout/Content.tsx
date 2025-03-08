import { useContext, } from "react";
import ADJContext from "../context/ADJContext";
import { BoardForm } from "../components/BoardForm";
import { Board, BoardId, BoardInfo } from "../types/Board";
import { ADJ } from "../types/ADJ";

interface Props {
    selectedSection: string;
}

export const Content = ({ selectedSection }: Props) => {

    const ADJInfo = useContext(ADJContext) as ADJ;

    if(selectedSection === 'general_info') {
        return (
            <div>General Info Section</div>
        )
    } else {

        const selectedBoard = ADJInfo.boards.find((board: Board) => Object.keys(board)[0] === selectedSection) as Board;
        const selectedBoardId = Object.keys(selectedBoard)[0] as BoardId;
        const selectedBoardInfo = selectedBoard[selectedBoardId] as BoardInfo;

        return (
            <div>
                <h2 className="text-2xl font-bold">Board {selectedBoardId}</h2>
                <BoardForm boardId={selectedBoardId} boardInfo={selectedBoardInfo} />
            </div>
        )
    }
};

