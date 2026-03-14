"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../common/Layout";

export default function ManageAddress() {

    const [addresses, setAddresses] = useState([]);
    const [addAddress, setAddAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    const states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Delhi"
    ];

    const [form, setForm] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        addressType: ""
    });

    /* ---------------- Fetch Addresses ---------------- */

    const fetchAddress = async () => {
        try {
            const res = await axios.get("/api/address");
            setAddresses(res.data.data);
        } catch (error) {
            toast.error("Failed to load addresses");
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    /* ---------------- Input Change ---------------- */

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    /* ---------------- Add Address ---------------- */

    const handleAddAddress = async () => {
        try {
            setLoading(true);

            const res = await axios.post("/api/address", form);

            setAddresses([...addresses, res.data.data]);

            toast.success("Address Added Successfully");

            setForm({
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                country: "India",
                pincode: "",
                addressType: ""
            });

            setAddAddress(false);

        } catch (error) {
            toast.error("Error adding address");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Delete Address ---------------- */

    const deleteAddress = async (id) => {
        try {

            await axios.delete(`/api/address/${id}`);

            setAddresses(addresses.filter((item) => item._id !== id));

            toast.success("Address deleted");

        } catch (error) {
            toast.error("Delete failed");
        }
    };

    /* ---------------- Set Default ---------------- */

    const setDefault = async (id) => {
        try {

            await axios.put(`/api/address/default/${id}`);

            const updated = addresses.map((item) => ({
                ...item,
                isDefault: item._id === id
            }));

            setAddresses(updated);

            toast.success("Default Address Updated");

        } catch (error) {
            toast.error("Error updating default");
        }
    };

    return (
        <Layout heading="Manage Address">

            <div className="bg-gray-50 py-10">

                <div className="container mx-auto px-4 max-w-[1430px]">

                    {/* Header */}

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-2xl font-semibold">
                            Your Addresses
                        </h2>

                        <button
                            onClick={() => setAddAddress(!addAddress)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
                        >
                            {addAddress ? "Cancel" : "+ Add Address"}
                        </button>

                    </div>

                    {/* Address List */}

                    <div className="space-y-4">

                        {addresses?.map((item) => (

                            <div
                                key={item._id}
                                className="bg-white border rounded-lg p-5 flex justify-between items-start hover:shadow-md transition"
                            >

                                <div
                                    className="cursor-pointer"
                                    onClick={() => setDefault(item._id)}
                                >

                                    <div className="flex items-center gap-2 mb-1">

                                        <input
                                            type="radio"
                                            checked={item.isDefault}
                                            readOnly
                                        />

                                        <span className="font-semibold">
                                            {item.addressLine1}
                                        </span>

                                        {item.isDefault && (
                                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                Default
                                            </span>
                                        )}

                                    </div>

                                    <p className="text-gray-600 text-sm">
                                        {item.addressLine2}
                                    </p>

                                    <p className="text-gray-600 text-sm">
                                        {item.city}, {item.state}, {item.country} - {item.pincode}
                                    </p>

                                </div>

                                <button
                                    onClick={() => deleteAddress(item._id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>

                            </div>

                        ))}

                    </div>

                    {/* Add Address Form */}

                    {addAddress && (

                        <div className="bg-white mt-8 border rounded-lg p-6">

                            <h3 className="text-lg font-semibold mb-6">
                                Add New Address
                            </h3>

                            <div className="p-6 lg:p-10">
                                <div className="flex flex-wrap -mx-2.5">

                                    {/* Street Address */}
                                    <div className="w-full px-2.5 mb-3 lg:mb-6">
                                        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                            Street Address
                                        </label>

                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={form.addressLine1}
                                            onChange={handleChange}
                                            className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* State */}
                                    <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                            State
                                        </label>

                                        <select
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select State</option>

                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City */}
                                    <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Address Type */}
                                    <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                            Address Type
                                        </label>

                                        <select
                                            name="addressType"
                                            value={form.addressType}
                                            onChange={handleChange}
                                            className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Address Type</option>
                                            <option value="Home">Home</option>
                                            <option value="Office">Office</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="mt-6 text-right">

                                <button
                                    onClick={handleAddAddress}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-lg"
                                >
                                    {loading ? "Adding..." : "Save Address"}
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </Layout>
    );
}