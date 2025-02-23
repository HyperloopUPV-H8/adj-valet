import { useEffect, useState } from 'react';
import ADJContext from './context/ADJContext';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { ADJ_INFO_MOCK } from './api/mock';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {

    const [ADJInfo, setADJInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setADJInfo(ADJ_INFO_MOCK);
            setIsLoading(false);
        }, 1000)
    }, []);
    
    return (
        <div className="h-full flex gap-4">
            { isLoading ?
                <div className="flex items-center justify-center w-full h-full">
                    <LoadingSpinner />
                </div>
                : 
                <ADJContext.Provider value={ADJInfo}>
                    <Sidebar></Sidebar>

                    <Content></Content>
                </ADJContext.Provider>
            }
        </div>
    );
}

export default App;
