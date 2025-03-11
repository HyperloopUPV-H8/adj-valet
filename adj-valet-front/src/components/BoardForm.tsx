import { useADJStore } from '../store/ADJStore';
import { BoardInfo, BoardName } from '../types/Board';
import { Input } from './Input';
import { MeasurementForm } from './MeasurementForm';

interface Props {
    boardName: BoardName;
    boardInfo: BoardInfo;
}

export const BoardForm = ({ boardName, boardInfo }: Props) => {
    const { updateBoard } = useADJStore();

    return (
        <div className="w-[25rem] flex flex-col">
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
                {boardInfo.measurements.map((measurement) => {
                    return (
                        <li key={measurement.id}>
                            <MeasurementForm
                                boardName={boardName}
                                measurement={measurement}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
