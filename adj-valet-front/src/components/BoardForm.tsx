import { useADJStore } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { Input } from './Input';

interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
}

export const BoardForm = ({ boardName, boardInfo }: Props) => {
    const { updateBoard } = useADJStore();

    return (
        <div className="flex flex-col p-12">
            <Input
                object={boardInfo}
                field={'board_id'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <Input
                object={boardInfo}
                field={'board_ip'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <ul>
                {boardInfo.measurements.map((measurement, index) => {
                    return (
                        <li
                            key={index}
                            className="my-4 rounded-lg bg-gray-100 p-2"
                        ></li>
                    );
                })}
            </ul>
        </div>
    );
};
