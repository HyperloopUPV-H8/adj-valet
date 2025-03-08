import { BoardId } from "../types/Board";
import { Measurement } from "../types/Measurement";
import { Input } from "./Input";

interface Props {
    boardId: BoardId;
    measurement: Measurement;
}

export const MeasurementForm = ({boardId, measurement}: Props) => {
    console.log(boardId);

    return (
        <>
            <Input label='Measurement Name' value={measurement.name} />
            <Input label='Measurement Type' value={measurement.type} />

            <Input label="Pod Units" value={measurement.podUnits}/>
            <Input label="Display Units" value={measurement.displayUnits}/>
            <Input label="Enum Values" value={measurement.enumValues.join(', ')}/>
            <Input label="Safe Range" value={measurement.safeRange.join(', ')}/>
            <Input label="Warning Range" value={measurement.warningRange.join(', ')}/>
        </>
    );
};
