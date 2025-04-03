import { BoardForm } from '../components/BoardForm';
import { GeneralInfoForm } from '../components/GeneralInfoForm';
import { useADJStore } from '../store/ADJStore';
import { Board, BoardName, BoardInfo } from '../types/Board';

interface Props {
    selectedSection: string;
    setSelectedSection: (section: string) => void;
}

export const Content = ({ selectedSection, setSelectedSection }: Props) => {
    const { boards, removeBoard } = useADJStore();

    if (selectedSection === 'general_info') {
        return <GeneralInfoForm />;
    } else {
        const selectedBoard = boards.find(
            (board: Board) => Object.keys(board)[0] === selectedSection,
        ) as Board;
        const selectedBoardName = Object.keys(selectedBoard)[0] as BoardName;
        const selectedBoardInfo = selectedBoard[selectedBoardName] as BoardInfo;

        return (
            <div className="w-full overflow-scroll px-12 pt-12">
                <div className="mb-8 flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                        Board {selectedBoardName}
                    </h2>
                    <button
                        className="flex cursor-pointer items-center gap-2 rounded-full bg-red-500 p-2 text-white"
                        onClick={() => {    
                            removeBoard(selectedBoardName);
                            setSelectedSection('general_info');                            
                        }}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
                <BoardForm
                    boardName={selectedBoardName}
                    boardInfo={selectedBoardInfo}
                    setSelectedSection={setSelectedSection}
                />
            </div>
        );
    }
};
