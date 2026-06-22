import { useState, useEffect } from "react";

export function InputBox({ data: parentData = null, handleChange: parentHandleChange = null }) {
    const [localData, setLocalData] = useState({ state: "", city: "" });

    const usingParent = parentData && typeof parentHandleChange === "function";
    const data = usingParent ? parentData : localData;
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!usingParent) {
            setLocalData(prev => ({ ...prev, [name]: value }));
        }

        if (typeof parentHandleChange === "function") {
            parentHandleChange(e);
        }
    };

    return (
        <div className="w-full grid grid-cols-2  gap-2 px-2.5 mb-3 lg:mb-6">
            {/* STATE */}
            <div>
                <input
                    type="text"
                    name="state"
                    value={data?.state || ""}
                    onChange={handleChange}
                    required
                    placeholder="State"
                    className="w-full px-4 py-3 border border-[#808080] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-500"
                />
            </div>

            {/* CITY */}
            <div>
                <input
                    type="text"
                    name="city"
                    value={data?.city || ""}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 border border-[#808080] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-500"
                />
            </div>
        </div>
    );
}
