import { useEffect, useState } from "react";
import { Board } from "../types/Board";
import { Input } from "./Input";

interface Props {
    board: Board | undefined
}

export const BoardForm = ({ board }: Props) => {

    const [boardState, setBoardState] = useState(board);

    useEffect(() => {
        setBoardState(board);
    }, [board, board?.board_id]);

    if(!board) return <div>Board info not found</div>;

    return <div className="px-8 py-4">
        {/* Board ID */}
        <Input label="Board ID" value={boardState?.board_id.toString()}/>

        {/* Board IP */}
        <Input label="Board IP" value={boardState?.board_ip}/>

        {/* Measurements */}
        { board.measurements.map((measurement) => {
            const measurementId = Object.keys(measurement)[0];
            const measurementInfo = measurement[measurementId];
            return <>
                <div className="mt-2 text-2xl">MeasurementId: "{measurementId}"</div>
                {Object.keys(measurementInfo).map((key, index) => {
                    return <div className="pl-6">
                            <Input key={`${board.board_id}/${index}`} label={key} value={measurementInfo[key] as string}/>
                        </div>
                })}
            </>
        }) }
        {/* Packets */}
    </div>;
};
