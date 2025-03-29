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
        <div className="flex w-[25rem] flex-col">

            <h2 className="mb-2 text-zinc-600 text-xl font-bold">Board ID</h2>
            <Input
                object={boardInfo}
                field={'board_id'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <h2 className="mb-2 mt-8 text-zinc-600 text-xl font-bold">Board IP</h2>
            <Input
                object={boardInfo}
                field={'board_ip'}
                setObject={(field, value) =>
                    updateBoard(boardName, field, value)
                }
            />

            <h2 className="mt-8 mb-2 text-zinc-600 text-xl font-bold">Packets</h2>
            <ul>
                {/* {boardInfo.measurements.map((measurement) => {
                    return (
                        <li key={measurement.id}>
                            <MeasurementForm
                                boardName={boardName}
                                measurement={measurement}
                            />
                        </li>
                    );
                })} */}

                {
                    
                }
            </ul>
        </div>
    );
};
