import React, { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const Popup = ({ isOpen, onClose, children, size ,title }) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/20 z-50 px-3 py-6">
      <div className={`bg-white rounded-lg w-full shadow-lg ${size}`}>
        <div className="p-6 text-gray-800 overflow-y-auto max-h-[90vh] relative">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
