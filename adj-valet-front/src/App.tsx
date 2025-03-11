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

    useEffect(() => {
        setTimeout(() => {
            setADJStore(ADJ_INFO_MOCK);
            setIsLoading(false);
        }, 1000);
    }, [setADJStore]);

    return (
        <div className="flex h-full">
            {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className='flex h-full w-full'>
                    <Sidebar
                        selectedSection={selectedSection}
                        onSelectedSection={(section: string) =>
                            setSelectedSection(section)
                        }
                    ></Sidebar>

                    <Content
                        selectedSection={selectedSection}
                    ></Content>
                </div>
            )}
        </div>
    );
}

export default App;
