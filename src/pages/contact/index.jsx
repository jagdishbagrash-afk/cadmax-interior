import React, { useState } from "react";
import Layout from "../common/Layout";
import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";
import toast from "react-hot-toast";
import Listing from "../api/Listing";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";



export default function Contact() {

    const data = [
        {
            icon: <FaPhoneAlt />,
            title: "Phone",
            content: "+91 98765 43210",
        },
        {
            icon: <FaEnvelope />,
            title: "Email",
            content: "support@cadmaxatelier.com",
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Address",
            content: (
                <>
                    Cadmax Atelier Pvt. Ltd. <br />
                    123, Interior Street, <br />
                    Design City, India - 110001
                </>
            ),
        },
        {
            icon: <FaClock />,
            title: "Working Hours",
            content: (
                <>
                    Mon - Sat: 10:00 AM - 7:00 PM <br />
                    Sunday: Closed
                </>
            ),
        },
    ];
    const [Regs, setRegs] = useState({
        name: "",
        email: "",
        message: "",
        services: "",
        phone_number: "",
    });
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setRegs((prevState) => ({ ...prevState, [name]: value }));
    };

    const [loading, setLoading] = useState(false);

    const handleForms = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!Regs.name || !Regs.email || !Regs.phone_number || !Regs.services || !Regs.message) {
            toast.error("Please fill out all fields.");
            setLoading(false);
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(Regs.phone_number)) {
            toast.error("Phone number must be exactly 10 digits.");
            setLoading(false);
            return;
        }

        // 3️⃣ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Regs.email)) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        const main = new Listing();
        try {
            const updatedRegs = {
                ...Regs,
            };
            const response = await main.contact(updatedRegs);
            console.log("response", response)
            if (response?.data?.status) {
                toast.success(response.data.message);
                setRegs({
                    name: "",
                    email: "",
                    message: "",
                    subject: "",
                    phone_number: "",
                    services: ""
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error); // Log the error for debugging
            toast.error("Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className="bg-white">
                {/* Hero */}
                {/* Hero */}
                <Banner
                    Slider1={ProductListBanner}
                    title={"Contact Us"}
                />


                {/* Form + Text */}
                <div className="bg-[#FFFFFF] py-[40px] md:py-[60px] lg:py-[80px]">
                    <div className="max-w-[1320px] mx-auto px-4 flex flex-col md:flex-row gap-10 lg:gap-16">

                        {/* LEFT SIDE - FORM */}
                        <div className="w-full md:w-[55%]">

                            {/* Heading */}
                            <div className="mb-6">
                                 <h2 className="text-[#171717] font-[900] mb-2  text-[18px] md:text-[35px] uppercase Creato">
                                    Get In Touch
                                </h2>
                                <p className="text-[#000112a6] text-[14px] md:text-[16px] Creato lg:text-[18px] mt-3">
                                    Fill out the form and our team will get back to you shortly.
                                </p>
                            </div>

                            {/* Form */}
                            <form className="flex flex-wrap gap-y-8 gap-x-6 text-sm">

                                {/* Name */}
                                <div className="w-full md:w-[48%] flex flex-col gap-2">
                                    <label className="text-[12px] uppercase text-[#4D4D4D]">
                                        FULL NAME*
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={Regs.name}
                                        onChange={handleInputs}
                                        required
                                        placeholder="your name"
                                        className="border-b border-gray-400 bg-transparent outline-none py-2 text-[15px] text-[#555]"
                                    />
                                </div>

                                {/* Email */}
                                <div className="w-full md:w-[48%] flex flex-col gap-2">
                                    <label className="text-[12px] uppercase text-[#4D4D4D]">
                                        EMAIL*
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={Regs.email}
                                        onChange={handleInputs}
                                        required
                                        placeholder="your email"
                                        className="border-b border-gray-400 bg-transparent outline-none py-2 text-[15px] text-[#555]"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="w-full md:w-[48%] flex flex-col gap-2">
                                    <label className="text-[12px] uppercase text-[#4D4D4D]">
                                        PHONE (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={Regs?.phone_number}
                                        onChange={handleInputs}
                                        placeholder="your phone"
                                        className="border-b border-gray-400 bg-transparent outline-none py-2 text-[15px] text-[#555]"
                                    />
                                </div>

                                {/* Service */}
                                <div className="w-full md:w-[48%] flex flex-col gap-2">
                                    <label className="text-[12px] uppercase text-[#4D4D4D]">
                                        SERVICE*
                                    </label>
                                    <select
                                        name="services"
                                        value={Regs?.services}
                                        onChange={handleInputs}
                                        className="border-b border-gray-400 bg-transparent outline-none py-2 text-[15px] text-[#555]"
                                    >
                                        <option value="">--select service--</option>
                                        <option value="home">Home Renovation</option>
                                        <option value="office">Office Setup</option>
                                        <option value="commercial">Commercial Design</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div className="w-full flex flex-col gap-2">
                                    <label className="text-[12px] uppercase text-[#4D4D4D]">
                                        MESSAGE*
                                    </label>
                                    <textarea
                                        rows="4"
                                        name="message"
                                        value={Regs?.message}
                                        onChange={handleInputs}
                                        placeholder="Message"
                                        className="border-b border-gray-400 bg-transparent outline-none py-2 text-[15px] text-[#555]"
                                    ></textarea>
                                </div>

                                {/* Button */}
                                <div className="w-full pt-4">
                                    <button
                                        type="submit"
                                        onClick={handleForms}
                                        disabled={loading}
                                        className="min-w-[200px] bg-[#000000] text-white px-6 py-3 transition-all duration-300 hover:bg-black"
                                    >
                                        {loading ? "Processing..." : "GET A QUOTE"}
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* RIGHT SIDE - CONTACT INFO */}
                        <div className="w-full md:w-[45%]">

                            <div className=" p-6 md:p-8  space-y-6">
                                {data.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">

                                        {/* Icon */}
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-sm shrink-0">
                                            {item.icon}
                                        </div>

                                        {/* Text */}
                                        <div>
 <h2 className="text-[#171717] font-[900] mb-2  text-[18px] md:text-[20px] uppercase Creato">
                                                {item.title}
                                            </h2>
                                  <p className="text-[#4D5466] font-[500] text-[16px]  
                       tracking-[-0.01em] text-center Creato">
                                                {item.content}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>

                <div>
                    <div className="w-full h-[300px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.169941188254!2d75.79705307537076!3d26.83308127670687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3b25d2a3a41%3A0x2dc19e9a7e949dd5!2sPrism%20Tower%2C%20Lal%20Kothi%20Scheme%2C%20Tonk%20Rd%2C%20Gandhi%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302015!5e0!3m2!1sen!2sin!4v1693395287562!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                </div>
            </div>
        </Layout>
    );
}