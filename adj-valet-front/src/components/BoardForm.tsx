import { BoardId, BoardInfo } from '../types/Board';
import { Input } from './Input';
import { MeasurementForm } from './MeasurementForm';

interface Props {
    boardId: BoardId;
    boardInfo: BoardInfo;
}

export const BoardForm = ({ boardId, boardInfo }: Props) => {
    console.log(boardId, boardInfo);

    return (
        <div className="flex flex-col p-12">
            <Input label="Board ID" value={boardInfo.board_id.toString()} />

            <Input label="Board IP" value={boardInfo.board_ip} />

            <ul>
                {boardInfo.measurements.map((measurement, index) => {
                    return (
                        <li key={index} className='bg-gray-100 p-2 rounded-lg my-4'>
                            <MeasurementForm
                                boardId={boardId}
                                measurement={measurement}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
