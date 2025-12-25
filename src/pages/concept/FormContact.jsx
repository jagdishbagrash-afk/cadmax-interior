import React, { useState } from "react";
import Listing from "../api/Listing";
import toast from "react-hot-toast";

export default function FormContact() {
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        email: "",
        name: "",
        message: "",
        area: "",
        phone_number: "",
        timeline: "",
        payment: "",
        services: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const main = new Listing();
            const res = await main.AddContact({
                phone_number: data.phone_number,
                name: data.name,
                email: data.email,
                message: data.message,
                area: data.area,
                timeline: data.timeline,
                payment: data.payment,
                services: data.services
            });

            if (res?.data?.status) {
                localStorage.setItem("token", res?.data?.token);
                toast.success(res?.data?.message);
            } else {
                toast.error(res?.data?.message || "Invalid OTP");
            }
            setLoading(false);
            setData({
                phone_number: "",
                name: "",
                email: "",
                message: "",
                built: "",
                area: "",
                timeline: "",
                payment: "",
                services: ""
            })
        } catch (error) {
            toast.error("Verification failed");
            setLoading(false);

        }
    };
    return (
        <div className="border border-[#4D54661A] rounded-lg shadow-sm">
            <h2 className=" Creato  font-[900] p-4 text-[18px] font-black leading-[100%] tracking-[-0.02em] uppercase text-[#171717] ">
                QUOTE REQUEST
            </h2>
            <div className="border-b-2 border-[#4D54661A] mb-4" />
            <div className="px-4 ">
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"

                        name="name"
                        value={data.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Phone
                    </label>
                    <input
                        maxLength={10}
                        value={data.phone_number}
                        onChange={handleChange}
                        type="tel"
                        name="phone_number"
                        placeholder="Phone"
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"

                    />
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={data.email}
                        name="email"
                        onChange={handleChange}
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"

                    />
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Built‑up Area (sq.ft)
                    </label>
                    <input
                        type="text"
                        placeholder="Built‑up Area (sq.ft)"
                        value={data.area}
                        name="area"
                        onChange={handleChange}
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"

                    />
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Service Type
                    </label>
                    <select
                        value={data.services}
                        name="services"
                        onChange={handleChange}

                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                    >
                        <option>Service Type</option>
                        <option value={"Consultancy"}>Consultancy</option>
                        <option value={"Turnkey"} >Turnkey</option>
                    </select>
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Timeline
                    </label>
                    <select
                        value={data.timeline}
                        name="timeline"
                        onChange={handleChange}
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                    >
                        <option>Timeline</option>
                        <option value={"Consultancy"}>Consultancy</option>
                        <option value={"Turnkey"} >Turnkey</option>
                    </select>
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        Payment Preference
                    </label>
                    <select
                        value={data.payment}
                        name="payment"
                        onChange={handleChange}
                        className="w-full h-11 lg:h-[54px] font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                    >
                        <option>Payment Preference</option>
                        <option value={"Consultancy"}>Consultancy</option>
                        <option value={"Turnkey"} >Turnkey</option>
                    </select>
                </div>
                <div className="mb-3 md:mb-[15px]">
                    <label className="block Creato text-[14px] font-medium leading-[140%] tracking-[0.08em] uppercase text-[#4D5466] mb-1">
                        MESSAGE
                    </label>
                    <textarea
                        rows="6"
                        placeholder="Message"
                        className="w-full   font-semibold block bg-white text-[#46494D] border border-gray-300 rounded-lg px-3 lg:px-5 leading-tight focus:outline-none"
                        value={data.message}
                        name="message"
                        onChange={handleChange}
                    />
                </div>
                <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="cursor-pointer w-full h-[56px] Creato text-[14px] font-bold leading-[100%] tracking-[0.08em] uppercase text-white bg-black mt-6 hover:bg-gray-900 transition">
                    {loading ? "Processing..." : "Submit"}
                </button>
            </div>
        </div>
    );
}
