import { JSX } from "react";
import { Board } from "../types/Board";
import { GeneralInfo } from "../types/GeneralInfo"
import { JsonObject } from "../App";

interface Props {
    selectedData: GeneralInfo | Board | undefined;
    renderInputs: (obj: JsonObject, path?: string[]) => JSX.Element[]
}

export const Content = ({ selectedData, renderInputs}: Props) => {
    return (
        <div className="px-8 py-4">
            {selectedData ? renderInputs(selectedData as JsonObject) : <p>No hay datos disponibles</p>}
        </div>
    )
}