import React from 'react';

const Modal = ({ isOpen, onClose, title, textClose="Fermer", children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay text-black flex flex-col justify-center z-[2222]">
            <div className="modal-content text-center flex flex-col ">
                <h2>{title}</h2>
                <div className=" flex flex-col justify-around">
                {children}
                </div>
                <button className='bg-green-500 rounded-md p-2 m-4 items-end' onClick={onClose}>{textClose}</button>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index : 100000;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default Modal;