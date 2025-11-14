import React from 'react'

export default function Button({ title, classes, image }) {
  return (
    <button
      className={`
        px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]
        ${classes}
      `}
    >
      {title}
    </button>
  )
}