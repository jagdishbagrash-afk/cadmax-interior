import React from "react";

function BookingForm() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT SIDE FORM SECTION */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* PROJECT DETAILS */}
          <div className="">
            <h2 className="text-xl font-semibold mb-5">PROJECT DETAILS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Property Type" className="input" />
              <input type="text" placeholder="Service Needed" className="input" />
              <input type="text" placeholder="Build-up Area" className="input" />
              <input type="text" placeholder="Set Budget Range" className="input" />
            </div>
          </div>

          {/* MATERIAL & FINISH */}
          <div className="">
            <h2 className="text-xl font-semibold mb-5">MATERIAL & FINISH PREFERENCES</h2>

            <select className="input">
              <option>Select Material</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>

            <select className="input mt-5">
              <option>Select Finish</option>
              <option>Matte</option>
              <option>Glossy</option>
              <option>Textured</option>
            </select>
          </div>

          {/* CONTACT */}
          <div className="">
            <h2 className="text-xl font-semibold mb-5">CONTACT INFORMATION</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Full Name" className="input" />
              <input type="text" placeholder="Phone Number" className="input" />
              <input type="email" placeholder="Email Address" className="input" />
              <input type="text" placeholder="Preferred Design Style" className="input" />
            </div>
          </div>

          {/* TIMELINE */}
          <div className="">
            <h2 className="text-xl font-semibold mb-5">ESTIMATED TIMELINE</h2>

            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>3D Rendering Timeline</span>
                <span>3–4 Days</span>
              </li>
              <li className="flex justify-between">
                <span>Concept & Moodboard</span>
                <span>5–7 Days</span>
              </li>
              <li className="flex justify-between">
                <span>Material & Finish Selection</span>
                <span>1–2 Days</span>
              </li>
              <li className="flex justify-between">
                <span>Execution/Finalization</span>
                <span>Based on Scope</span>
              </li>
            </ul>
          </div>

        </div>

        {/* RIGHT SIDE PRICING CARD */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border sticky top-10">
            <h2 className="text-xl font-semibold mb-5">PRICING BREAKDOWN</h2>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Project (2 BHK)</span>
                <span>₹25,000</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹4,500</span>
              </div>

              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>₹29,500</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Final Amount</span>
                <span className="text-black">₹30,000</span>
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-900 transition">
              CONFIRM BOOKING
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingForm;
