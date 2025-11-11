import React from 'react';

const Switch = ({ checkedValue, handleChange }) => {
  return (
    <label className="relative inline-block w-[34px] h-[18px] cursor-pointer">
      <input
        type="checkbox"
        checked={checkedValue}
        onChange={handleChange}
        className="peer sr-only"
      />
      <span
        className={`
          block w-full h-full rounded-full transition-all duration-200
          bg-white/20 shadow-[inset_0_0_3px_rgba(0,0,0,0.5),inset_0_0_0_16px_rgba(0,0,0,0.15),inset_0_0_0_0_#22cc3f,inset_0_1px_0_rgba(224,224,224,0.4)]
          peer-checked:shadow-[inset_0_0_3px_rgba(0,0,0,0.5),inset_0_0_0_1px_#22cc3f,inset_0_0_0_16px_#22cc3f,inset_0_1px_0_rgba(224,224,224,0.4)]
        `}
      ></span>
      <span
        className={`
          absolute top-[1.5px] left-[1.5px] w-[15px] h-[15px] rounded-full bg-[#e3e3e3]
          shadow-[0_3px_3px_rgba(0,0,0,0.3)] transition-all duration-300
          peer-checked:left-[17px]
        `}
      ></span>
    </label>
  );
};

export default Switch;