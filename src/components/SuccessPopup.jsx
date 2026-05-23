"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineX,
  HiOutlineHome,
} from "react-icons/hi";

import {
  FaCheck,
  FaPhoneAlt,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

import { useRouter } from "next/navigation";

export default function SuccessPopup({
  open,
  onClose,
}) {

  const router = useRouter();

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-[99999]
            bg-black/60 backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
        >

          {/* POPUP */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              relative
              w-full max-w-[450px]
              rounded-[32px]
              bg-white
              shadow-[0_20px_80px_rgba(0,0,0,0.25)]
              overflow-hidden
            "
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                w-10 h-10 rounded-full
                hover:bg-gray-100
                flex items-center justify-center
                transition-all duration-200
              "
            >
              <HiOutlineX size={22} />
            </button>

            {/* CONTENT */}
            <div className="px-7 pt-10 pb-7 text-center">

              {/* SUCCESS ICON */}
              <div className="flex justify-center">

                <div
                  className="
                    w-[110px] h-[110px]
                    rounded-full
                    bg-[#F1FAF1]
                    flex items-center justify-center
                  "
                >

                  <div
                    className="
                      w-[72px] h-[72px]
                      rounded-full
                      bg-[#43A047]
                      flex items-center justify-center
                      shadow-lg
                    "
                  >
                    <FaCheck
                      className="text-white"
                      size={34}
                    />
                  </div>

                </div>

              </div>

              {/* TITLE */}
              <h2
                className="
                  mt-8
                  text-[24px]
                  leading-[38px]
                  font-bold
                  text-[#111]
                "
              >
                Inquiry Submitted Successfully
              </h2>

              {/* DESCRIPTION */}
              <p
                className="
                  mt-4
                  text-[15px]
                  leading-7
                  text-[#666]
                "
              >
                Our design team will contact you shortly
                regarding your custom design or vendor
                inquiry.
              </p>

              {/* CONTACT BOX */}
              <div
                className="
                  mt-7
                  rounded-[24px]
                  bg-[#F7F7F7]
                  px-5 py-5
                  space-y-4
                "
              >

                {/* PHONE */}
                <div className="flex items-center justify-center gap-3">

                  <div
                    className="
                      w-10 h-10 rounded-full
                      bg-green-100
                      flex items-center justify-center
                    "
                  >
                    <FaPhoneAlt
                      size={16}
                      className="text-green-600"
                    />
                  </div>

                  <span className="text-[15px] font-medium text-[#111]">
                    +91 8890249999
                  </span>

                </div>

                {/* EMAIL */}
                <div className="flex items-center justify-center gap-3">

                  <div
                    className="
                      w-10 h-10 rounded-full
                      bg-orange-100
                      flex items-center justify-center
                    "
                  >
                    <MdEmail
                      size={20}
                      className="text-orange-500"
                    />
                  </div>

                  <span className="text-[15px] font-medium text-[#111] break-all">
                    info@cadmaxatelier.com
                  </span>

                </div>

              </div>

              {/* BUTTON */}
              <button
                onClick={() => router.push("/")}
                className="
                  mt-8
                  w-full h-[58px]
                  rounded-2xl
                  bg-black
                  hover:bg-[#111]
                  text-white
                  text-[16px]
                  font-semibold
                  flex items-center justify-center gap-3
                  transition-all duration-300
                  shadow-lg hover:scale-[1.02]
                "
              >

                <HiOutlineHome size={20} />

                Go To Home Page

              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}