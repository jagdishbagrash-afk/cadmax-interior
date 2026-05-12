import { State, City } from "country-state-city";
import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

export function InputBox({ data: parentData = null, handleChange: parentHandleChange = null }) {
    const [localData, setLocalData] = useState({ state: "", city: "" });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

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

    useEffect(() => {
        const indianStates = State.getStatesOfCountry("IN") || [];
        setStates(indianStates);
    }, []);

    useEffect(() => {
        const stateName = data?.state || "";

        if (stateName) {
            const selectedStateObj = states.find(st => st.name === stateName);

            if (selectedStateObj) {
                const cityList = City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
                setCities(cityList);
            }
        } else {
            setCities([]);
        }
    }, [data?.state, states]);

    return (
        <div className="w-full grid grid-cols-2  gap-2 px-2.5 mb-3 lg:mb-6">
            {/* STATE */}
            <div className=" relative">
                <select
                    name="state"
                    value={data?.state || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-10 border border-[#808080] rounded-[8px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-500"
                >
                    <option value="" disabled>Select State</option>
                    {states && states.length > 0 ? (
                        states.map((st) => (
                            <option key={st.isoCode} value={st.name}>
                                {st.name}
                            </option>
                        ))
                    ) :
                        (
                            <option disabled>
                                No data
                            </option>
                        )}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IoChevronDown className="transition-transform" />
                </span>
            </div>

            {/* CITY */}
            <div className="relative">
                <select
                    name="city"
                    value={data?.city || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-10 border border-[#808080] rounded-[8px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-500"
                >
                    <option value="" disabled>Select City</option>
                    {cities && cities.length > 0 ? (
                        cities.map((ct) => (
                            <option key={ct.name} value={ct.name}>
                                {ct.name}
                            </option>
                        ))

                    ) : (
                        <option disabled>
                            No data
                        </option>

                    )}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IoChevronDown className="transition-transform" />
                </span>
            </div>
        </div>
    );
}