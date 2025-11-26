import React from "react";

function BookingForm() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex justify-center py-10 px-4">
      <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1230px] px-4">
        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-10">


          {/* LEFT SIDE FORM SECTION */}
          <div className="lg:col-span-2 space-y-10">
            {/* PROJECT DETAILS */}
            <div className="">
              <h2 className="mb-5 Creato text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] mb-5">
                PROJECT DETAILS
              </h2>
              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Project Type
                </label>
                <select
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                >
                  <option value="">Select Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Service Model
                </label>
                <select
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                >
                  <option value="">Select Service Model</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Built-Up Area
                </label>


                <input type="text" placeholder="Built-Up Area"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Estimated Budget Range
                </label>
                <input type="text" placeholder="Estimated Budget Range"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
            </div>

            {/* MATERIAL & FINISH */}
            <div className="">
              <h2 className=" mb-5 Creato text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] mb-5">
                MATERIAL & FINISH PREFERENCES
              </h2>

              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Finish Level                  </label>

                <select
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                >
                  <option value="">Select Finish Level</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Furniture & Fixture Scope
                </label>
                <select
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                >
                  <option value="">Select  Furniture & Fixture Scope</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <div className="">
              <h2 className=" mb-5 Creato text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] mb-5">

                CONTACT INFORMATION</h2>

              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Full Name
                </label>


                <input type="text" placeholder="Full Name"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Phone Number
                </label>


                <input type="text" placeholder=" Phone Number"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Email Address
                </label>


                <input type="text" placeholder="  Email Address"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  City / Project Location
                </label>


                <input type="text" placeholder="     City / Project Location"

                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>

              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Preferred Contact Mode              </label>

                <select
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                >
                  <option value="Whatapps">Whatapps</option>
                  <option value="Phone">Phone </option>
                </select>
              </div>
            </div>
            <div className="">
              <h2 className=" Creato text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] mb-5">

                ESTIMATED TIMELINE</h2>

              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#4D5466]">
                    3D Rendering Timeline
                  </span>

                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#171717]">
                    3–4 Days</span>
                </li>
                <li className="flex justify-between">
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#4D5466]">
                    Concept & Moodboard</span>
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#171717]">
                    5–7 Days</span>
                </li>
                <li className="flex justify-between">
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#4D5466]">
                    Material & Finish Selection</span>
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#171717]">
                    1–2 Days</span>
                </li>
                <li className="flex justify-between">
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#4D5466]">
                    Execution/Finalization</span>
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#171717]">
                    Based on Scope</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border-2 border-[#4D54661A] rounded-md sticky top-10">
              <h2 className="Creato text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] mb-4">
                Pricing Breakdown
              </h2>
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between py-3">
                  <span className="Creato text-[16px] font-medium leading-[140%] tracking-[-0.02em] text-[#4D5466]">
                    Rate (₹ / sq. ft.)
                  </span>
                  <span className="Creato text-[16px] font-medium text-[#171717]">
                    ₹2,500
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="Creato text-[16px] font-medium text-[#4D5466]">
                    Subtotal
                  </span>
                  <span className="Creato text-[16px] font-medium text-[#171717]">
                    ₹30,00,000
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="Creato text-[16px] font-medium text-[#4D5466]">
                    Taxes & Fees
                  </span>
                  <span className="Creato text-[16px] font-medium text-[#171717]">
                    ₹90,000
                  </span>
                </div>

                <div className="flex justify-between py-3 font-semibold">
                  <span className="Creato text-[16px] font-medium text-[#4D5466]">
                    Estimated Total
                  </span>
                  <span className="Creato text-[16px] font-bold text-[#171717]">
                    ₹30,90,000
                  </span>
                </div>
              </div>
              <button className="w-full h-[56px] Creato text-[14px] font-bold leading-[100%] tracking-[0.08em] uppercase text-white bg-black mt-6 hover:bg-gray-900 transition">
                CONFIRM BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
