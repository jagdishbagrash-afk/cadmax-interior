"use client";
import Listing from "@/pages/api/Listing";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

export default function DeleteImages({
    image = "https://media.collegesathi.com/images/1775537518604-formimage.webp",
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClosePopup = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const main = new Listing();
            const res = await main.DeleteImageUrl({ imageUrl: image });

            if (res) {
                toast.success("Deleted successfully");
                setOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Image Card */}
            <div className="relative w-[300px] h-[300px] group">
                <img
                    src={image}
                    alt="image"
                    className="w-full h-full object-cover rounded-md"
                />

                <button
                    onClick={() => setOpen(true)}
                    className="
      absolute top-2 right-2 
      bg-red-600 text-white p-2 rounded-full shadow-lg
      opacity-100
      transition-all duration-300
    "
                >
                    <MdDelete size={20} />
                </button>
            </div>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 z-[9999999] flex items-center justify-center px-3"
                    onClick={handleClosePopup}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="
              w-full 
              max-w-[95%] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[750px]
              rounded-2xl 
              bg-white/90 backdrop-blur-md
              border border-white
              p-5 sm:p-6
              max-h-[90vh] overflow-y-auto
              shadow-xl
            "
                    >
                        {/* Title */}
                        <div className="mb-6 text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-red-600">
                                Delete Image
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={image}
                                alt="preview"
                                className="w-full max-w-[300px] h-[200px] object-cover rounded-lg"
                            />

                            <p className="text-lg sm:text-xl text-center font-medium">
                                Are you sure you want to delete this image?
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-lg disabled:opacity-50"
                                >
                                    {loading ? "Deleting..." : "Yes"}
                                </button>

                                <button
                                    onClick={handleClosePopup}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}