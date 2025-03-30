import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                {children}
            </div>
        </div>
    );
};
