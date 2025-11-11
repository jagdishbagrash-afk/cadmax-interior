import React from 'react'
import { useRouter } from "next/router";
import Image from 'next/image';

export default function NoData({ Heading, content, className }) {
    const router=useRouter();
  return (
    // <div className="lg:px-24 lg:py-24 sm:py-20 md:px-44 px-4 py-12 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      // <div className="w-full lg:w-1/2 relative pb-12 lg:pb-0">
          <div className={`relative text-center ${className}`}>
      <Image
        src="/no-data.png" // replace with your actual image path
        alt="Banner Icon"
        width={500}
        height={500}
        className="mx-auto mt-2 mb-3 h-[80px] w-auto"
      />
      <h1 className="my-2 text-gray-800 font-bold text-lg lg:text-xl xl:text-2xl capitalize">
        {Heading}
      </h1>
      <p className="my-2 text-gray-800">
        {content}
      </p>
      {/* <button
        onClick={() => {
          if (url) {
            router.push(url);
          } else {
            router.back();
          }
        }}
        className="flex mx-auto bg-[#CC2828] hover:bg-[#ad0e0e] text-white text-base py-3.5 px-8 xl:px-10 font-medium cursor-pointer rounded-full"
      >
        Take me there!
      </button> */}
    </div>
      // </div>
    // </div>
  )
}
