import { SimpleBoardForm } from '../components/SimpleBoardForm';
import { GeneralInfoForm } from '../components/GeneralInfoForm';
import { useADJState, useADJActions } from '../store/ADJStore';
import { Board, BoardName, BoardInfo } from '../types/Board';

interface Props {
    selectedSection: string;
    setSelectedSection: (section: string) => void;
}

export const Content = ({ selectedSection, setSelectedSection }: Props) => {
    const { config } = useADJState();
    const { removeBoard } = useADJActions();

    if (!config) {
        return <div>No configuration loaded</div>;
    }

    if (selectedSection === 'general_info') {
        return <GeneralInfoForm />;
    } else {
        const selectedBoard = config.boards.find(
            (board: Board) => Object.keys(board)[0] === selectedSection,
        ) as Board;
        
        if (!selectedBoard) {
            return <div>Board not found</div>;
        }
        
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
                <SimpleBoardForm
                    boardName={selectedBoardName}
                    boardInfo={selectedBoardInfo}
                    setSelectedSection={setSelectedSection}
                />
            </div>
        );
    }
};
