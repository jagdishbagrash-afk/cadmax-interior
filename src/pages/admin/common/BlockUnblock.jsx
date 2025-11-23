import React, { useState } from 'react';
import { MdClose, MdBlock, MdLockOpen } from "react-icons/md";
import toast from 'react-hot-toast';
import Listing from '@/pages/api/Listing';
import Popup from '@/pages/common/Popup';

export default function BlockUnblock({ Id, status, fetchData, step }) {
    console.log("status", status)
    console.log("id", Id)
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);
    const handleClose = () => setIsOpen(false);

    const handleSubperDelete = () => {
        setLoading(true);
        const main = new Listing();
        const response = main.Supercategorydelete(Id);
        response
            .then((res) => {
                if (res && res?.data?.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data?.message || "Something went wrong.");
                }
                setLoading(false);
                fetchData();
                toggleModal();
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            });
    };

    const handlecategroyDelete = () => {
        setLoading(true);
        const main = new Listing();
        const response = main.categorydelete( Id );
        response
            .then((res) => {
                console.log(res.data)
                if (res && res?.data?.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data?.message || "Something went wrong.");
                }
                setLoading(false);
                fetchData();
                toggleModal();
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            });
    };

    const handleSubcategroyDelete = () => {
        setLoading(true);
        const main = new Listing();
        const response = main.Subcategorydelete( Id );
        response
            .then((res) => {
                console.log(res.data)
                if (res && res?.data?.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data?.message || "Something went wrong.");
                }
                setLoading(false);
                fetchData();
                toggleModal();
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            });
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (step === 1) {
            handleSubperDelete(e);
        } else if (step === 2) {
            handlecategroyDelete(e)
        }
         else if (step === 3) {
            handleSubcategroyDelete(e)
        }
        else {
            console.warn('Invalid step');
        }
    };

    return (
        <div className="flex flex-col">
            {/* Block/Unblock Button */}
            <button
                onClick={toggleModal}
                className="cursor-pointer gap-[10px] m-auto font-[600] text-white text-[18px] bg-white p-2 rounded-lg"
            >
                {status === true ? (
                    <MdLockOpen size={22} className="text-green-600 hover:text-green-700" />
                ) : (
                    <MdBlock size={22} className="text-red-600 hover:text-red-700" />
                )}

            </button>

            {/* Popup */}
            {isOpen && (
                <Popup
                    isOpen={isOpen}
                    onClose={handleClose}
                    size={"max-w-lg"}
                    className="shadow-none"
                >
                    {/* Header */}
                    <div className="border-b px-6 py-5 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {status === true ? "Block User" : "Unblock User"}
                        </h2>
                        <button onClick={handleClose} className="text-gray-700 hover:text-gray-900">
                            <MdClose size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="py-6 px-10">
                        <p className="text-black mb-2 text-[15px]">
                            Are you sure you want to {status === true ? "block" : "unblock"} this user?
                        </p>
                        <p className="text-red-600 text-[13px]">
                            (This action can be changed later.)
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 px-6 pb-6">
                        <button
                            onClick={toggleModal}
                            className="text-black px-4 py-2 border border-gray-300 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleClick}
                            className="cursor-pointer bg-black hover:bg-white font-[700] text-[14px] px-[20px] py-[10px] text-white hover:text-black rounded-[5px]"
                        >
                            {loading ? "Processing..." : status === true  ? "Block" : "Unblock"}
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
}
