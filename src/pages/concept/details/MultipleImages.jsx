"use client";

import { useState } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";
import { MdClose } from "react-icons/md";

export default function MultipleImages({ project }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = project?.multiple_images || [];

    if (!images.length) return null;

    const handlePrev = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const handleNext = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    return (
        <>
            {/* ================= IMAGE GRID ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => {
                            setCurrentIndex(index);
                            setIsOpen(true);
                        }}
                    >
                        <img
                            src={img}
                            alt={project?.title || "Project Image"}
                            className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                        />
                    </div>
                ))}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    {/* Close Button */}
                    <button
                        className="absolute top-5 right-5 text-black text-3xl cursor-pointer "
                        onClick={() => setIsOpen(false)}
                    >
                     <MdClose size={48}/>
                    </button>

                    {/* Prev Button */}
                    <button
                        className="absolute left-5 text-white text-4xl cursor-pointer  bg-[#ffffff] rounded-full p-3"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === 0
                                    ? project.multiple_images.length - 1
                                    : currentIndex - 1
                            )
                        }
                    >
                                            <FcPrevious size={24} />

                    </button>

                    {/* Image */}
                    <img
                        src={project.multiple_images[currentIndex]}
                        alt="Preview"
                        className="w-full  object-cover  shadow-lg"
                    />

                    {/* Next Button */}
                    <button
                        className="absolute right-5 text-white text-4xl cursor-pointer bg-[#ffffff] rounded-full p-3"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === project.multiple_images.length - 1
                                    ? 0
                                    : currentIndex + 1
                            )
                        }
                    >
                        <FcNext size={24} />
                    </button>
                </div>
            )}

        </>
    );
}
