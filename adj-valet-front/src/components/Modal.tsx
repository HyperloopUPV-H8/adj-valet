import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
