import { BoardName } from '../types/Board';
import { Measurement } from '../types/Measurement';
import { Input } from './Input';
import { useADJStore } from '../store/ADJStore';
import { useState } from 'react';

interface Props {
    boardName: BoardName;
    measurement: Measurement;
}

export const MeasurementForm = ({ boardName, measurement }: Props) => {
    const [isDisplayed, setIsDisplayed] = useState(false);
    const { updateMeasurement, updateRange  } = useADJStore();

    return (
        <div>
            <div
                className={`bg-hupv-blue flex flex-col rounded-xl p-4 text-white ${isDisplayed ? '' : 'hidden'}`}
            >
                <div className="text-end">
                    <i
                        className="fa-solid fa-down-left-and-up-right-to-center w-fit cursor-pointer text-end text-xl"
                        onClick={() => setIsDisplayed(false)}
                    ></i>
                </div>

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

                <Input
                    object={measurement.above}
                    field={'safe'}
                    setObject={(field, value) =>
                        updateRange(boardName, measurement.id, 'above', field, value)
                    }
                />

                <Input
                    object={measurement.above}
                    field={'warning'}
                    setObject={(field, value) =>
                        updateRange(boardName, measurement.id, 'above', field, value)
                    }
                />

                <Input
                    object={measurement.below}
                    field={'safe'}
                    setObject={(field, value) =>
                        updateRange(boardName, measurement.id, 'below', field, value)
                    }
                />

                <Input
                    object={measurement.below}
                    field={'warning'}
                    setObject={(field, value) =>
                        updateRange(boardName, measurement.id, 'below', field, value)
                    }
                />
            </div>

            <div
                className={`bg-hupv-blue cursor-pointer rounded-2xl px-4 py-2 text-white ${isDisplayed ? 'hidden' : ''}`}
                onClick={() => setIsDisplayed(true)}
            >
                <p>
                    {measurement.id} - {measurement.name}
                </p>
            </div>
        </div>
    );
};
