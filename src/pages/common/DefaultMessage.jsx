import React from 'react'
import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function DefaultMessage({className}) {
    return (
        <div className={`w-full lg:w-8/12  xl:w-9/12 flex flex-col   lg:h-[calc(100vh-128px)]  bg-[#F1F1F1] ${className}`}>
            <div className="flex-1 flex items-center justify-center  px-4 ">
                <div className="p-6 w-full text-center">
                    <IoChatboxEllipsesOutline size={48} className="mx-auto w-full max-w-xs md:max-w-sm" />
                    <h2 className="mt-6 text-lg md:text-xl font-semibold text-gray-800">
                        Select a Chat to Start Messaging
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 px-2">
                        Start a new chat, send messages, and connect anytime with ease. Everythings just one click away!
                    </p>
                </div>
            </div>
        </div>
    )
}
