// NavigationButtons.jsx
import React from 'react';

const NavigationButtons = () => {
    const handleBackButton = () => {
        window.history.back();
    };

    const handleForwardButton = () => {
        window.history.forward();
    };

    const handleRefreshButton = () => {
        window.location.reload();
    };

    return (
        <div className="flex space-x-2">
            <button
                className="p-2 rounded-sm bg-neutral-700 text-white flex flex-col  items-center"
                onClick={handleBackButton}
            >
                Reculer
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                className="p-2 rounded-sm bg-neutral-700 text-white flex flex-col  items-center"
                onClick={handleForwardButton}
            >
                Avancer
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <button
                className="p-2 rounded-sm bg-neutral-700 text-white flex flex-col  items-center"
                onClick={handleRefreshButton}
            >
                Rafraichir
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/></svg>
               
            </button>
        </div>
    );
};

export default NavigationButtons;
