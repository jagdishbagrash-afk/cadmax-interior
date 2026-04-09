"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import { InputBox } from "@/components/InputBox";

export default function ManageAddress() {
    const [data, setData] = useState([]);
    const [addAddress, setAddAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const handleEdit = (item) => {

        setForm({
            street_address: item.street_address,
            city: item.city,
            state: item.state,
            country: item.country,
            pincode: item.pincode,
            addressType: item.addressType
        });

        setEditId(item._id);
        setEditOpen(true);

    };



    const [form, setForm] = useState({
        street_address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        addressType: ""
    });

    /* ---------------- Fetch Addresses ---------------- */

    const fetchAddress = async () => {
        try {
            const main = new Listing();
            const response = await main.AddressList();

            if (response?.data?.data?.addresses) {
                setData(response.data.data.addresses);
            } else {
                setData([]);
            }

        } catch (error) {
            console.log(error);
            setData([]);
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
        // ✅ Validation
        if (
            !form.street_address.trim() ||
            !form.city.trim() ||
            !form.state.trim() ||
            !form.country.trim() ||
            !form.pincode.trim() ||
            !form.addressType.trim()
        ) {
            return toast.error("All fields are required");
        }

        // ✅ Optional: Pincode validation (India)
        if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
            return toast.error("Enter valid 6 digit pincode");
        }

        try {
            setLoading(true);

            const main = new Listing();
            const response = await main.AddAddress(form);

            if (response?.data) {
                toast.success(response.data.message);

                fetchAddress();
                setAddAddress(false);

                // reset form
                setForm({
                    street_address: "",
                    city: "",
                    state: "",
                    country: "India",
                    pincode: "",
                    addressType: "",
                });
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to add address"
            );
        } finally {
            setLoading(false);
        }
    };
    /* ---------------- Update Address  ---------------- */

    const updateAddress = async () => {
        try {
            setLoading(true);
            const main = new Listing();
            const response = await main.UpdateAddressUser(editId, form);
            toast.success(response.data.message);
            setEditOpen(false);
            fetchAddress();
        } catch {

            toast.error("Update failed");

        } finally {

            setLoading(false);

        }

    };

    /* ---------------- Delete ---------------- */

    const deleteAddress = async (id) => {

        try {

            const main = new Listing();

            const response = await main.DeleteAddressList(id);

            toast.success(response.data.message);

            fetchAddress();

        } catch {

            toast.error("Delete failed");

        }

    };

    /* ---------------- Set Default ---------------- */

    const setDefault = async (id) => {

        try {

            const main = new Listing();

            await main.DefalutAddressList(id);

            toast.success("Default Address Updated");

            fetchAddress();

        } catch {

            toast.error("Error updating default");

        }

    };

    return (
        <Layout heading="Manage Address">

            <div className="bg-gray-50 min-h-screen py-10">

                <div className="max-w-[1230px] mx-auto px-4">

                    {/* Header */}

                    <div className="flex justify-between items-center mb-8">

                        <h2 className="text-2xl font-semibold text-gray-800">
                            Your Addresses
                        </h2>

                        <button
                            onClick={() => setAddAddress(!addAddress)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            {addAddress ? "Cancel" : "+ Add Address"}
                        </button>

                    </div>

                    {/* Address List */}

                    <div className="space-y-4">

                        {data?.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No address found
                            </div>
                        )}

                        <div className="space-y-4">

                            {data?.map((item) => {

                                const isDeleted = item.deletedAt !== null;

                                return (

                                    <div
                                        key={item._id}
                                        className={`border rounded-xl p-5 transition flex justify-between items-start
        ${isDeleted
                                                ? "bg-gray-200 opacity-70 "
                                                : "bg-white hover:shadow-md"
                                            }`}
                                    >

                                        {/* Address Info */}
                                        <div
                                            className={` cursor-pointer flex gap-3 ${isDeleted ? "" : "cursor-pointer"}`}
                                            onClick={() => !isDeleted && setDefault(item._id)}
                                        >

                                            <input
                                                type="radio"
                                                checked={item.isDefault}
                                                readOnly
                                                disabled={isDeleted}
                                                className="mt-1 cursor-pointer"
                                            />

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <span className="font-semibold text-gray-800">
                                                        {item.street_address}
                                                    </span>

                                                    {item.isDefault && (
                                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="text-gray-500 text-sm mt-1">
                                                    {item.addressType}
                                                </p>

                                                <p className="text-gray-600 text-sm">
                                                    {item.city}, {item.state}, {item.country} - {item.pincode}
                                                </p>

                                            </div>

                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-center items-center text-center gap-4 ">
                                            {!isDeleted && (
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                                                >
                                                    Edit
                                                </button>

                                            )}
                                            <button
                                                onClick={() => deleteAddress(item._id)}
                                                className={`${isDeleted ? "text-green-500 hover:text-green-700 text-sm" : "text-red-500 hover:text-red-700 text-sm"} cursor-pointer`}
                                            >
                                                {isDeleted ? "Restored" : "Delete"}

                                            </button>
                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                    {/* Add Address Form */}



                    {addAddress && (

                        <div className="bg-white mt-8 border rounded-lg p-6">

                            <h3 className="text-lg font-semibold mb-6">
                                Add New Address
                            </h3>

                            <div className="flex flex-wrap -mx-2.5">

                                {/* Street Address */}
                                <div className="w-full px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Street Address
                                    </label>

                                    <input
                                        type="text"
                                        name="street_address"
                                        value={form.street_address}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <InputBox data={form} handleChange={handleChange} />

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
                                        required
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
                                        required
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Address Type</option>
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other </option>

                                    </select>
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
            {editOpen && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-full max-w-lg p-6">

                        <h3 className="text-lg font-semibold mb-6">
                            Edit Address
                        </h3>

                        <div className="space-y-4">

                            <input
                                type="text"
                                name="street_address"
                                value={form.street_address}
                                onChange={handleChange}
                                placeholder="Street Address"
                                className="w-full border rounded-lg p-3"
                            />
                            <InputBox data={form} handleChange={handleChange} />

                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="Pincode"
                                className="w-full border rounded-lg p-3"
                            />

                            <select
                                name="addressType"
                                value={form.addressType}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >

                                <option value="">Address Type</option>
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>

                            </select>

                        </div>

                        <div className="flex justify-end gap-4 mt-6">

                            <button
                                onClick={() => setEditOpen(false)}
                                className="px-5 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateAddress}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                {loading ? "Updating..." : "Update Address"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </Layout>
    );
}