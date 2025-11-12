import React from 'react'

export default function Button({ title, classes, image }) {
  return (
    <button className={`font-bold cursor-pointer uppercase py-2 px-5 ${classes} `}>
      {title}

      {image && (image)}
    </button>
  )
}
