import React from "react";
import Link from "next/link";
import FooterLogo from "../../Assets/Images/CADMAX.png";
import Image from "next/image";
export default function Footer() {
     return (
        <>
       
          <footer className="bg-[#000000] pt-[50px] md:pt-[60px] lg:pt-[90px] pb-[15px] md:pb-[20px]">
              <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4">
                  <div className="flex flex-wrap -mx-4 justify-between text-center md:text-left">
                     <div className="w-full md:w-[324px] px-4 mb-5 md:mb-0 ">
                        <Link href="/" > 
                           <Image className="block mx-auto md:mx-0" src={FooterLogo} alt="img" />
                        </Link>
                     </div>
                     <div className="w-full md:w-[324px] px-4 text-center md:text-left">
                        <h3 className="text-[#ffffff] text-lg lg:text-xl -tracking-[0.04em] font-bold mb-3 md:mb-4">
                           Quick Links
                        </h3>
                        <ul className="space-y-1">
                           <li>
                              <Link href="/" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline">Home</Link>
                           </li>
                           <li>
                              <Link href="/find-teacher" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline">Find a Teacher</Link>
                           </li>
                           <li>
                              <Link href="/#howitwork" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline">How It Works</Link>
                           </li>
                           <li>
                              <Link href="/#faq" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline">FAQ</Link>
                           </li>
                           <li>
                              <p className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline">
                              Contact: office@japaneseforme.com
                              </p>
                           </li>
                        </ul>
                     </div>

                     <div className="w-full md:w-[324px] px-4 ">
                        <ul className="space-y-1">
                           <li>
                              <Link href="/term-conditions" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline " >Terms & condition</Link>
                           </li>
                           <li>
                              <Link href="/privacy-policy" className="-tracking-[0.03em] text-base text-[#ffffff] hover:underline" >Privacy Policy</Link>
                           </li> 
                        </ul>
                     </div>
                  </div>
              </div>
              <div className="border-t border-[rgba(56,121,117,0.2)] pt-3.5 mt-10 md:mt-16 lg:mt-28 text-center">
                 <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4">
                    <p className="text-[#ffffff] -tracking-[0.03em] text-sm lg:text-base m-0">© 2025 Japanese for Me. All Rights Reserved.</p>
                 </div>
              </div>
          </footer>
        </>
     )
}