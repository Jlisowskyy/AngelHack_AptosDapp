'use client';

import React, {useState} from 'react';
import {X} from 'lucide-react';

const ModalWindow = ({children, isOpen, onClose}: {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void
}) => {

    if (!isOpen) return (<></>);

    return (
        <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
            <div className={"absolute inset-0 bg-black opacity-50"}/>
            <div className={`relative bg-white rounded-lg p-6`}>
                <button onClick={onClose} className={"absolute top-2 right-2"}>
                    <X size={24}/>
                </button>
                {children}
            </div>
        </div>
    );
}

interface ModalPopupProps {
    children: (openModal: () => void) => React.ReactNode;
    modalWindow: (closeModal: () => void) => React.ReactNode;
}

const ModalPopup: React.FC<ModalPopupProps> = ({modalWindow, children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {children(openModal)}
            <ModalWindow isOpen={isModalOpen} onClose={closeModal}>
                {modalWindow(closeModal)}
            </ModalWindow>
        </>
    );
};

export default ModalPopup;