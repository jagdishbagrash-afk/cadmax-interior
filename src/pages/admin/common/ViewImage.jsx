import Popup from '@/pages/common/Popup';
import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

export default function ViewImage({ view }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setIsPopupOpen(true);
                }}
                className="ml-2 text-blue-600 underline"
            >
                View
            </button>
            {isPopupOpen && (

            <div className="fixed inset-0 flex items-center justify-center bg-gray-900/20 z-50">
                <div className={`bg-white rounded-lg w-full shadow-lg max-w-[300]`}>
                    <div className="p-4 text-gray-800 overflow-y-auto max-h-[80vh] relative">
                        <button
                           onClick={() => {
                    setIsPopupOpen(false);
                }}
                            className="cursor-pointer text-gray-600 hover:text-gray-800 focus:outline-none absolute right-4 top-3 z-[2]"
                        >
                            <IoCloseSharp size={24} />
                        </button>
                        <img
                            src={view}
                            alt="Preview"
                            className=" rounded-md"
                        />
                    </div>
                </div>
            </div>
            )}
        </>
    );
}
