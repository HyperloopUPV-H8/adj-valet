import { JSX, useEffect, useState } from 'react';
import ADJContext from './context/ADJContext';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { ADJ_INFO_MOCK } from './api/mock';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ADJ } from './types/ADJ';

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonData = JsonObject;

function App() {
    const [ADJInfo, setADJInfo] = useState<ADJ>();
    const [isLoading, setIsLoading] = useState(true);
    const [updatedData, setUpdatedData] = useState<JsonData>(ADJInfo || {});

    const [selectedSection, setSelectedSection] =
        useState<string>('general_info');

    const handleChange = (path: string[], value: JsonValue) => {
        setUpdatedData((prevData) => {
            // Realizamos una copia profunda de los datos
            const updated = JSON.parse(JSON.stringify(prevData)); // Copia profunda de los datos
            let temp: any = updated;

            // Navegar por la ruta y actualizar el valor
            path.slice(0, -1).forEach((key) => {
                temp = temp[key];
            });

            // Actualizamos el último valor en la ruta
            temp[path[path.length - 1]] = value;

            return updated;
        });
    };

    const renderInputs = (
        obj: JsonObject,
        path: string[] = [],
    ): JSX.Element[] => {
        return Object.keys(obj).map((key) => {
            const newPath = [...path, key];
            const value = obj[key];

            // Si es un objeto, renderiza recursivamente
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} className="mb-4">
                        <strong className="block text-lg font-semibold">
                            {key}:
                        </strong>
                        <div className="ml-4">
                            {renderInputs(value as JsonObject, newPath)}
                        </div>
                    </div>
                );
            } else {
                // Si es un valor primitivo (string, number, etc.), renderiza el input
                return (
                    <div key={key} className="mb-2">
                        <label className="block text-sm font-medium">
                            {key}:
                        </label>
                        <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={getValueFromPath(updatedData, newPath)}
                            onChange={(e) =>
                                handleChange(
                                    newPath,
                                    typeof value === 'number'
                                        ? Number(e.target.value)
                                        : e.target.value,
                                )
                            }
                            className="w-full rounded-md border border-gray-300 px-2 py-1"
                        />
                    </div>
                );
            }
        });
    };

    const getValueFromPath = (obj: JsonObject, path: string[]): JsonValue => {
        return path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    };

    const selectedData =
        selectedSection === 'general_info'
            ? ADJInfo?.general_info
            : ADJInfo?.boards.find((board) => board[selectedSection])?.[
                  selectedSection
              ];

    useEffect(() => {
        setTimeout(() => {
            setADJInfo(ADJ_INFO_MOCK);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="flex h-full">
            {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <ADJContext.Provider value={ADJInfo}>
                    <Sidebar
                        selectedSection={selectedSection}
                        onSelectedSection={(section: string) =>
                            setSelectedSection(section)
                        }
                    ></Sidebar>

                    <Content
                        selectedData={selectedData}
                        renderInputs={renderInputs}
                    ></Content>
                </ADJContext.Provider>
            )}
        </div>
    );
}

export default App;
