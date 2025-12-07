import React, { useState } from "react";
import Listing from "../api/Listing";
import toast from "react-hot-toast";

function BookingForm() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    email: "",
    project_type: "",
    servcies_model: "",
    area: "",
    budget_range: "",
    finish_level: "",
    scope: "",
    name: "",
    phone_number: "",
    city: "",
    phone_mode: "",
    timeLine: "",
    rate: 2500 || "",
    subtotal: 5500 || "",
    taxes: 8500 || "",
    total_amount: 8700 || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log("data", data)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.AddBooking({
        project_type: data?.project_type,
        servcies_model: data?.servcies_model,
        area: data?.area,
        budget_range: data?.budget_range,
        finish_level: data?.finish_level,
        scope: data?.scope,
        phone_number: data?.phone_number,
        rate: data?.rate || 8500,
        subtotal: data?.subtotal || 87000,
        taxes: data?.taxes || 9000,
        total_amount: data?.total_amount || 900000,
        email: data?.email,
        city: data?.city,
        phone_mode: data?.phone_mode,
        timeLine: data?.timeLine || "aaa",
        name: data?.name || ""
      });

      if (response?.data?.status) {
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
      setLoading(false);
      setData({
        name: "",
        phone_mode: "",
        phone_number: "",
        project_type: "",
        servcies_model: "",
        scope: "",
        area: "",
        budget_range: "",
        finish_level: "",
        rate: "",
        subtotal: "",
        taxes: "",
        total_amount: "",
        email: "",
        city: "", timeLine: ""
      })
    } catch (error) {
      console.error("API error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
    setLoading(false);
  };

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
                  name="project_type"
                  onChange={handleChange}
                  value={data?.project_type}
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
                  name="servcies_model"
                  onChange={handleChange}
                  value={data?.servcies_model}
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
                  name="area"
                  onChange={handleChange}
                  value={data?.area}
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Estimated Budget Range
                </label>
                <input type="text" placeholder="Estimated Budget Range"
                  name="budget_range"
                  onChange={handleChange}
                  value={data?.budget_range}
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
                  Finish Level
                </label>

                <select
                  name="finish_level"
                  onChange={handleChange}
                  value={data?.finish_level}
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
                  name="scope"
                  onChange={handleChange}
                  value={data?.scope}
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

                <input type="text"
                  placeholder="Full Name"
                  name="name"
                  onChange={handleChange}
                  value={data?.name}
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone_number"
                  maxLength={10}
                  value={data.phone_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setData((prev) => ({
                        ...prev,
                        phone_number: value,
                      }));
                    }
                  }}
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />

              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Email Address
                </label>


                <input type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={handleChange}
                  value={data?.email}
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>
              <div className="mb-3">

                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  City / Project Location
                </label>
                <input type="text" placeholder="City / Project Location"
                  name="city"
                  onChange={handleChange}
                  value={data?.city}
                  className="w-full h-11 lg:h-[56px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                />
              </div>

              <div className="mb-3">
                <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                  Preferred Contact Mode              </label>

                <select
                  name="phone_mode"
                  onChange={handleChange}
                  value={data?.phone_mode}
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
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full h-[56px] Creato text-[14px] font-bold leading-[100%] tracking-[0.08em] uppercase text-white bg-black mt-6 hover:bg-gray-900 transition">
                {loading ? "Processing..." : "CONFIRM BOOKING"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
