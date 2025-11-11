import React from 'react'

export default function Heading({title ,  classess}) {
  return (
    <div>
      <h2 className={`font-inter text-[24px] md:text-[30px] lg:text-[36px] xl:text-[45px] leading-[28px] md:leading-[40px] lg:leading-[54px] font-extrabold -tracking-[0.04em] ${classess}`}>
         {title}
      </h2>
    </div>
  )
}
