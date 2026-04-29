"use client";

import { useState, useEffect } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";
import { MdClose } from "react-icons/md";

export default function MultipleImages({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = project?.multiple_images || [];

  if (!images.length) return null;

  // 🔁 Navigation
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // ⌨️ Keyboard support (ESC, ←, →)
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

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
              className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-300"
            />
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {isOpen && (
           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* ❌ Close Button */}
          <button
            className="absolute top-[40px] right-5 text-white bg-black z-50"
            onClick={() => setIsOpen(false)}
          >
            <MdClose size={40} />
          </button>

          {/* ⬅️ Prev */}
          <button
            className="absolute left-5 z-50 bg-white rounded-full p-3 shadow-md hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <FcPrevious size={24} />
          </button>

          <img
            src={images[currentIndex]}
            alt="Preview"
            className="w-full  h-[800px] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-5 z-50 bg-white rounded-full p-3 shadow-md hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <FcNext size={24} />
          </button>
        </div>
      )}
    </>
  );
}