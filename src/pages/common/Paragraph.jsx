import React from 'react'

export default function Paragraph({title , classess}) {
  return (
    <p className={`${classess} text-white`}> {title}</p>
  )
}
