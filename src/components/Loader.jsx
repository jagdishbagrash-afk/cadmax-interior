// components/common/Loader.jsx
import React from "react";

const Loader = ({ fullScreen = true }) => {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "h-[500px]" : "h-[50vh]"
        }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;