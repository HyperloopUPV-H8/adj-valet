import { useEffect, useState } from 'react';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { ADJ_INFO_MOCK } from './api/mock';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useADJStore } from './store/ADJStore';

function App() {
    const { setADJStore } = useADJStore();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('general_info');
    const [ADJPath, setADJPath] = useState('');
    const adj_path = localStorage.getItem('adj_path');

    // useEffect(() => {
    //     setTimeout(() => {
    //         setADJStore(ADJ_INFO_MOCK);
    //         setIsLoading(false);
    //     }, 1000);
    // }, [setADJStore]);

    useEffect(() => {
        setTimeout(() => {
            setADJStore(ADJ_INFO_MOCK);
            setIsLoading(false);
        });
        // if(!adj_path) {
        //     setIsLoading(false);

        // }
    }, [adj_path]);

    function onEnterADJDir(): void {
        localStorage.setItem('adj_path', ADJPath);
        window.location.reload();
    }

    return (
        <div className="flex h-full">
            {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : !adj_path ? (
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
                </div>
            ) : (
                <div className="flex h-full w-full">
                    <Sidebar
                        selectedSection={selectedSection}
                        onSelectedSection={(section: string) =>
                            setSelectedSection(section)
                        }
                    ></Sidebar>

                    <Content selectedSection={selectedSection}></Content>
                </div>
            )}
        </div>
    );
}

export default App;
