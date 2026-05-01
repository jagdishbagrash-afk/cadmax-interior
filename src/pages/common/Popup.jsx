import React, { useEffect } from "react";

const Popup = ({ isOpen, onClose, children }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-[99999]"
      onClick={onClose}   // ✅ outside click closes modal
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()} // ✅ prevent close on inner click
      >
        <div className="px-4 text-gray-800 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
