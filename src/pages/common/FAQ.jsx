import { useState } from "react";
import Heading from "./Heading";

export default function FAQ({ classess, Faq, heading }) {
  const [openIndex, setOpenIndex] = useState(null);

  const ToggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`pb-[40px] md:pb-[40px] lg:pb-[60px] ${classess}`}>
      {Faq && Faq?.length > 0 && (
        <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1230px] px-4">
          <Heading
            classess="text-[#1E1E1E] mb-3"
            title= {heading || "Frequently Asked Questions"}
          />

          {Faq && Faq?.map((items, index) => (
            <div key={index} className="border-b border-[#C6C7C8]">
              <button
                onClick={() => ToggleFaq(index)}
                className="block w-full text-left bg-white border-none py-3 md:py-5 -tracking-[0.04em] font-semibold text-base md:text-lg lg:text-xl cursor-pointer relative pr-20"
              >
                {items.question}
                {openIndex === index ? (
                  <span className="text-[#008F70] bg-[#C6E4DE] h-[32px] w-[32px] md:h-[38px] md:w-[38px] lg:h-[44px] lg:w-[44px] flex items-center justify-center block rounded-full absolute right-0 top-1/2 -translate-y-1/2">
                    -
                  </span>
                ) : (
                  <span className="text-[#008F70] bg-[#C6E4DE] h-[32px] w-[32px] md:h-[38px] md:w-[38px] lg:h-[44px] lg:w-[44px] flex items-center justify-center block rounded-full absolute right-0 top-1/2 -translate-y-1/2">
                    +
                  </span>
                )}
              </button>
              <div
                className={`pb-5 transition-all duration-500 overflow-hidden ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                {items.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
