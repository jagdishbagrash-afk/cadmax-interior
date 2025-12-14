import React from "react";

export default function FormContact() {
    return (
        <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Get a Quote</h3>

            <input
                type="text"
                placeholder="Name"
                className="w-full border rounded-md px-3 py-2 mb-3"
            />
            <input
                type="tel"
                placeholder="Phone"
                className="w-full border rounded-md px-3 py-2 mb-3"
            />
            <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-md px-3 py-2 mb-3"
            />
            <input
                type="text"
                placeholder="Built‑up Area (sq.ft)"
                className="w-full border rounded-md px-3 py-2 mb-3"
            />

            <select className="w-full border rounded-md px-3 py-2 mb-3">
                <option>Service Type</option>
                <option>Consultancy</option>
                <option>Turnkey</option>
            </select>

            <textarea
                rows="4"
                placeholder="Message"
                className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <button className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold hover:bg-gray-800 transition">
                Submit
            </button>
        </div>
    );
}
