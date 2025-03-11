import { BoardForm } from '../components/BoardForm';
import { useADJStore } from '../store/ADJStore';
import { Board, BoardName, BoardInfo } from '../types/Board';

interface Props {
    selectedSection: string;
}

export const Content = ({ selectedSection }: Props) => {
    const { boards } = useADJStore();

    if (selectedSection === 'general_info') {
        return <div>General Info Section</div>;
    } else {
        const selectedBoard = boards.find(
            (board: Board) => Object.keys(board)[0] === selectedSection,
        ) as Board;
        const selectedBoardName = Object.keys(selectedBoard)[0] as BoardName;
        const selectedBoardInfo = selectedBoard[selectedBoardName] as BoardInfo;

        return (
            <div className="w-full overflow-scroll pt-12 pl-12">
                <h2 className="text-2xl font-bold mb-8">
                    Board {selectedBoardName}
                </h2>
                <BoardForm
                    boardName={selectedBoardName}
                    boardInfo={selectedBoardInfo}
                />
            </div>
        );
    }
};
