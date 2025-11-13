import React from 'react'

export default function Button({ title, classes, image }) {
  return (
    <button className={`font-[700] cursor-pointer cartera uppercase py-2 px-5 ${classes} `}>
      {title}

      {image && (image)}
    </button>
  )
}
