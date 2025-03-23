import { useADJStore } from '../store/ADJStore';
import { ArrayObjForm } from './ArrayObjForm';

export const GeneralInfoForm = () => {
    const { general_info } = useADJStore();

    return (
        <div className="flex w-full gap-8 overflow-scroll p-8">
            {Object.keys(general_info).map((section) => (
                <ArrayObjForm key={section} sectionName={section} />
            ))}
        </div>
    );
};
