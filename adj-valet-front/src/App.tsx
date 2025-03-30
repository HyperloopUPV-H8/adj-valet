import { useState } from 'react';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { useADJStore } from './store/ADJStore';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ADJ_INFO_MOCK } from './api/mock';

function App() {
    const { setADJStore } = useADJStore();
    const [selectedSection, setSelectedSection] = useState('general_info');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ADJPath, setADJPath] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const adj_path = localStorage.getItem('adj_path');

    const onEnterADJDir = async () => {
        setIsLoading(true);
        try {
            await assembleADJ();
            // window.location.reload();
        } catch(error) {
            setErrorMessage(`${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    const assembleADJ = async () => {
        // await sendADJPath(ADJPath);
        localStorage.setItem('adj_path', ADJPath);
        // const adj = await assembleJSON();
        setADJStore(ADJ_INFO_MOCK);
    }

    return (
        <div className="flex h-full">
            { !adj_path ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold">No ADJ selected</h1>
                    <input
                        type="text"
                        placeholder="Enter the ADJ dir..."
                        className="w-180 rounded-2xl border p-2 px-4"
                        onChange={(event) => setADJPath(event.target.value)}
                    />
                    <button className="bg-hupv-orange cursor-pointer rounded-xl px-4 py-2 font-bold text-white" onClick={() => onEnterADJDir()}>
                        Continue
                    </button>
                    {
                        isLoading && <div>
                            <LoadingSpinner />
                        </div>
                    }
                    { 
                        errorMessage && <p className='text-red-500 font-bold'>
                            { errorMessage }
                        </p> 
                    }
                </div>
            ) : (
                <div className="flex h-full w-full">
                    <Sidebar
                        selectedSection={selectedSection}
                        onSelectedSection={(section: string) =>
                            setSelectedSection(section)
                        }
                    ></Sidebar>

                    <Content selectedSection={selectedSection} setSelectedSection={setSelectedSection}></Content>
                </div>
            )}
        </div>
    );
}

export default App;
