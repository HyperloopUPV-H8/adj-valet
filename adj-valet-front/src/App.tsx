import { useEffect, useState } from 'react';
import ADJContext from './context/ADJContext';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { ADJ_INFO_MOCK } from './api/mock';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ADJ } from './types/ADJ';

function App() {
    const [ADJInfo, setADJInfo] = useState<ADJ>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('general_info');

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
                        selectedSection={selectedSection}
                    ></Content>
                </ADJContext.Provider>
            )}
        </div>
    );
}

export default App;
