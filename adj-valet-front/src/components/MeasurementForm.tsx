import { BoardName } from "../types/Board";
import { Measurement } from "../types/Measurement";
import { Input } from "./Input";
import { useADJStore } from "../store/ADJStore";

interface Props {
    boardName: BoardName;
    measurement: Measurement;
}

export const MeasurementForm = ({boardName, measurement}: Props) => {

    const { updateMeasurement } = useADJStore();

    return (
        <div className="flex flex-col p-2 bg-zinc-100">
            <Input
                object={measurement}
                field={'id'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />
            
            <Input
                object={measurement}
                field={'name'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'type'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'displayUnits'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'podUnits'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            {/* <Input
                object={measurement}
                field={'enumValues'}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            /> */}

            <Input
                object={measurement}
                field={'above.safe' as keyof Measurement}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'above.warning' as keyof Measurement}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'below.safe' as keyof Measurement}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />

            <Input
                object={measurement}
                field={'below.warning' as keyof Measurement}
                setObject={(field, value) =>
                    updateMeasurement(boardName, measurement.id, field, value)
                }
            />
        </div>
    );
};
