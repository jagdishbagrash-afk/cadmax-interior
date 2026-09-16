"use client";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import { InputBox } from "@/components/InputBox";
import { State, City } from "country-state-city";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "280px",
    borderRadius: "12px",
};
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

// ---------- Render Suggestions (outside component) ----------
const renderSuggestions = (suggestions, status, onSelect) => {
    if (status === "OK" && suggestions.length > 0) {
        return (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {suggestions.map((suggestion) => (
                    <li
                        key={suggestion.place_id}
                        onClick={() => onSelect(suggestion.description)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                        {suggestion.description}
                    </li>
                ))}
            </ul>
        );
    }
    if (status === "ZERO_RESULTS") {
        return (
            <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 p-3 text-center text-gray-500 text-sm">
                No results found
            </div>
        );
    }
    return null;
};

// ---------- Address Input Field Component ----------
const AddressAutocompleteInput = ({
    label,
    name,
    value,
    setValue,
    suggestions,
    status,
    onSelect,
    placeholder,
    required = true,
    showCurrentButton = false,
    getCurrentLocation,
    locationLoading,
    isLoaded,
    handleChange,
}) => (
    <div className="w-full px-2.5 mb-3 lg:mb-6 relative">
        <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
            {label}
        </label>
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (handleChange) handleChange(e);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
                required={required}
                placeholder={placeholder}
                className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
            />
            {showCurrentButton && (
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading || !isLoaded}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 bg-white px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition disabled:opacity-50"
                >
                    {locationLoading ? (
                        <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                    <span className="hidden sm:inline">
                        {locationLoading ? "Fetching..." : "Current"}
                    </span>
                </button>
            )}
        </div>
        {renderSuggestions(suggestions, status, onSelect)}
    </div>
);

export default function ManageAddress() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    // ---- Modal states ----
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('Add');
    const [editId, setEditId] = useState(null);

    // ---- Nearby places states ----
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [showNearby, setShowNearby] = useState(false);
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedStateCode, setSelectedStateCode] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const allStates = State.getStatesOfCountry("IN");
        setStatesList(allStates);
    }, []);

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        setSelectedStateCode(stateCode);
        const stateObj = statesList.find((s) => s.isoCode === stateCode);
        const stateName = stateObj ? stateObj.name : "";
        setForm((prev) => ({
            ...prev,
            state: stateName,
            city: "",
        }));
        const cityList = City.getCitiesOfState("IN", stateCode);
        setCitiesList(cityList);
    };

    const handleCityChange = (e) => {
        setForm((prev) => ({ ...prev, city: e.target.value }));
    };

    const setStateByNameAndFetchCities = (stateName) => {
        if (!stateName) {
            setSelectedStateCode("");
            setCitiesList([]);
            return;
        }
        const stateObj = statesList.find(
            (s) => s.name.toLowerCase() === stateName.toLowerCase()
        );
        if (stateObj) {
            const code = stateObj.isoCode;
            setSelectedStateCode(code);
            setForm((prev) => ({ ...prev, state: stateObj.name }));
            const cityList = City.getCitiesOfState("IN", code);
            setCitiesList(cityList);
        } else {
            setForm((prev) => ({ ...prev, state: stateName }));
            setCitiesList([]);
            setSelectedStateCode("");
        }
    };

    // --- Places Autocomplete for Street Address ---
    const {
        ready: streetReady,
        value: streetValue,
        suggestions: { status: streetStatus, data: streetSuggestions },
        setValue: setStreetValue,
        clearSuggestions: clearStreetSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: { componentRestrictions: { country: "in" } },
        debounce: 300,
        cache: 86400,
    });

    const [form, setForm] = useState({
        street_address: "",
        flatNo: "",
        landmark: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        addressType: "",
    });

    const fetchAddress = async () => {
        try {
            const main = new Listing();
            const response = await main.AddressList();
            setData(response?.data?.data?.addresses || []);
        } catch (error) {
            console.log(error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const fillFormFromPlace = (place) => {
        const components = place.address_components;
        let street = "",
            city = "",
            state = "",
            country = "India",
            pincode = "";

        for (const comp of components) {
            const types = comp.types;
            if (types.includes("street_number")) street = comp.long_name + " " + street;
            if (types.includes("route")) street += comp.long_name;
            if (types.includes("locality") || types.includes("sublocality"))
                city = comp.long_name;
            if (types.includes("administrative_area_level_1"))
                state = comp.long_name;
            if (types.includes("country")) country = comp.long_name;
            if (types.includes("postal_code")) pincode = comp.long_name;
        }
        street = street.trim() || place.formatted_address;

        setForm((prev) => ({
            ...prev,
            street_address: street,
            city: city || prev.city,
            state: state || prev.state,
            country: country || prev.country,
            pincode: pincode || prev.pincode,
        }));

        if (state) {
            setStateByNameAndFetchCities(state);
        }
        setStreetValue(street, false);
        clearStreetSuggestions();
    };

    const fetchNearbyPlaces = (lat, lng) => {
        if (!window.google || !mapRef.current) {
            setShowNearby(false);
            return;
        }
        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            location: new window.google.maps.LatLng(lat, lng),
            radius: 2000,
            type: ["establishment", "address"],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                const filtered = results.slice(0, 6);
                setNearbyPlaces(filtered);
                setShowNearby(true);
            } else {
                setNearbyPlaces([]);
                setShowNearby(false);
            }
        });
    };

    const reverseGeocodeAndFill = async (lat, lng) => {
        try {
            const results = await getGeocode({ location: { lat, lng } });
            if (!results.length) throw new Error("No address found");
            const place = results[0];
            fillFormFromPlace(place);
            toast.success("Location updated");
            fetchNearbyPlaces(lat, lng);
        } catch (error) {
            console.error(error);
            toast.error("Could not get address for this location");
        }
    };

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    const onMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPos({ lat, lng });
        setMapCenter({ lat, lng });
        reverseGeocodeAndFill(lat, lng);
    };

    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPos({ lat, lng });
        setMapCenter({ lat, lng });
        reverseGeocodeAndFill(lat, lng);
    };

    const handlePlaceSelect = async (address) => {
        setStreetValue(address, false);
        clearStreetSuggestions();
        try {
            const results = await getGeocode({ address });
            if (!results.length) throw new Error("No results");
            const place = results[0];
            const { lat, lng } = await getLatLng(place);
            setMarkerPos({ lat, lng });
            setMapCenter({ lat, lng });
            fillFormFromPlace(place);
            toast.success("Address filled from Google Maps");
            fetchNearbyPlaces(lat, lng);
        } catch (error) {
            console.error(error);
            toast.error("Could not fetch address details");
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation)
            return toast.error("Geolocation not supported");
        setLocationLoading(true);
        toast.loading("Fetching your location...", { id: "location-toast" });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMarkerPos({ lat: latitude, lng: longitude });
                setMapCenter({ lat: latitude, lng: longitude });
                await reverseGeocodeAndFill(latitude, longitude);
                toast.success("Location fetched!", { id: "location-toast" });
                setLocationLoading(false);
            },
            (error) => {
                let msg = "Failed to get location";
                if (error.code === 1) msg = "Permission denied";
                else if (error.code === 2) msg = "Location unavailable";
                else if (error.code === 3) msg = "Request timed out";
                toast.error(msg, { id: "location-toast" });
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    const handleAddAddress = async () => {
        if (!form.street_address.trim() || !form.city.trim() || !form.state.trim() ||
            !form.country.trim() || !form.pincode.trim() || !form.addressType.trim()) {
            return toast.error("All fields are required");
        }
        if (!/^[1-9][0-9]{5}$/.test(form.pincode))
            return toast.error("Enter valid 6 digit pincode");

        try {
            setLoading(true);
            const main = new Listing();
            const response = await main.AddAddress(form);
            toast.success(response.data.message);
            fetchAddress();
            closeModal();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async () => {
        if (!editId) return toast.error("No address selected for update");
        try {
            setLoading(true);
            const main = new Listing();
            const response = await main.UpdateAddressUser(editId, form);
            toast.success(response.data.message);
            fetchAddress();
            closeModal();
        } catch {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

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

    const openAddModal = () => {
        setModalMode("add");
        setEditId(null);
        setForm({
            street_address: "",
            flatNo: "",
            landmark: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
            addressType: "",
        });
        setStreetValue("", false);
        clearStreetSuggestions();
        setMarkerPos(defaultCenter);
        setMapCenter(defaultCenter);
        setNearbyPlaces([]);
        setShowNearby(false);
        setModalOpen(true);
        setSelectedStateCode("");
        setCitiesList([]);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        setEditId(item._id);
        setForm({
            street_address: item.street_address || "",
            flatNo: item.flatNo || "",
            landmark: item.landmark || "",
            city: item.city || "",
            state: item.state || "",
            country: item.country || "India",
            pincode: item.pincode || "",
            addressType: item.addressType || "",
        });
        setStreetValue(item.street_address || "", false);
        clearStreetSuggestions();
        setNearbyPlaces([]);
        setShowNearby(false);
        setMarkerPos(defaultCenter);
        setMapCenter(defaultCenter);

        if (item.state) {
            setStateByNameAndFetchCities(item.state);
        } else {
            setSelectedStateCode("");
            setCitiesList([]);
        }

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalMode("add");
        setEditId(null);
        setSelectedStateCode("");
        setCitiesList([]);
        setForm({
            street_address: "",
            flatNo: "",
            landmark: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
            addressType: "",
        });
        setStreetValue("", false);
        clearStreetSuggestions();
        setMarkerPos(defaultCenter);
        setMapCenter(defaultCenter);
        setNearbyPlaces([]);
        setShowNearby(false);
    };

    if (loadError) {
        return (
            <Layout heading="Manage Address">
                <div className="bg-red-50 p-6 rounded-xl text-center text-red-600">
                    Error loading Google Maps. Please check your API key.
                </div>
            </Layout>
        );
    }

    return (
        <Layout heading="Manage Address">
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Addresses</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="bg-gradient-to-r from-slate-900 to-slate-800 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
                            >
                                + Add Address
                            </button>
                        </div>
                    </div>

                    {/* Address List - Hidden when Modal is Open */}
                    <div className={`space-y-4 transition-all duration-300 ${modalOpen ? "opacity-0 hidden" : "opacity-100 block"}`}>
                        {data?.length === 0 && (
                            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border">
                                No address found
                            </div>
                        )}
                        <div className="space-y-4">
                            {data?.map((item) => {
                                const isDeleted = item.deletedAt !== null;
                                return (
                                    <div
                                        key={item._id}
                                        className={`border rounded-xl p-5 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3
                                            ${isDeleted ? "bg-gray-200 opacity-70" : "bg-white hover:shadow-md"}`}
                                    >
                                        <div
                                            className={`flex gap-3 w-full sm:w-auto ${isDeleted ? "" : "cursor-pointer"}`}
                                            onClick={() => !isDeleted && setDefault(item._id)}
                                        >
                                            <input
                                                type="radio"
                                                checked={item.isDefault}
                                                readOnly
                                                disabled={isDeleted}
                                                className="mt-1 cursor-pointer flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-gray-800 break-words">
                                                        {item.street_address}
                                                    </span>
                                                    {item.flatNo && (
                                                        <span className="text-gray-500 text-sm">#{item.flatNo}</span>
                                                    )}
                                                    {item.isDefault && (
                                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded whitespace-nowrap">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                {item.landmark && (
                                                    <p className="text-gray-500 text-sm mt-1">Landmark: {item.landmark}</p>
                                                )}
                                                <p className="text-gray-500 text-sm mt-1">{item.addressType}</p>
                                                <p className="text-gray-600 text-sm break-words">
                                                    {item.city}, {item.state}, {item.country} - {item.pincode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center gap-4 flex-shrink-0 w-full sm:w-auto">
                                            {!isDeleted && (
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(item)}
                                                    className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => deleteAddress(item._id)}
                                                className={`${isDeleted ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"} text-sm cursor-pointer`}
                                            >
                                                {isDeleted ? "Restored" : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- Unified Modal (Inlined to prevent re-mounting & refreshing) ---------- */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 pt-28 pb-10 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[calc(100vh-160px)] overflow-y-auto relative my-auto shadow-2xl">
                        {/* Wrap in form to prevent Enter key from refreshing the page */}
                        <form onSubmit={(e) => e.preventDefault()}>
                            {/* Close (X) Button */}
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close"
                                className="absolute top-4 right-4 z-10 flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-lg font-semibold mb-6 pr-12">
                                {modalMode === "add" ? "Add New Address" : "Edit Address"}
                            </h3>

                            <div className="flex flex-wrap -mx-2.5">
                                {/* Map */}
                                <div className="w-full px-2.5 mb-4">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Pick location on map <span className="text-gray-400 text-xs font-normal">(drag pin or click)</span>
                                    </label>
                                    {isLoaded ? (
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={mapCenter}
                                            zoom={15}
                                            onClick={onMapClick}
                                            onLoad={onMapLoad}
                                            options={{ streetViewControl: false, mapTypeControl: false }}
                                        >
                                            <MarkerF
                                                position={markerPos}
                                                draggable={true}
                                                onDragEnd={onMarkerDragEnd}
                                            />
                                        </GoogleMap>
                                    ) : (
                                        <div className="h-[280px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                            Loading map...
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                        Click on the map or drag the pin to set your exact address.
                                    </p>
                                </div>

                                {/* Nearby Places List */}
                                {showNearby && nearbyPlaces.length > 0 && (
                                    <div className="w-full px-2.5 mt-2 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="font-medium text-sm text-[#8D929A]">
                                                📍 Nearby Places (Click to select)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setShowNearby(false)}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                Hide
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {nearbyPlaces.map((place) => (
                                                <div
                                                    key={place.place_id}
                                                    onClick={async () => {
                                                        const lat = place.geometry.location.lat();
                                                        const lng = place.geometry.location.lng();
                                                        setMarkerPos({ lat, lng });
                                                        setMapCenter({ lat, lng });
                                                        try {
                                                            const results = await getGeocode({ location: { lat, lng } });
                                                            if (results.length) {
                                                                fillFormFromPlace(results[0]);
                                                                toast.success("Address updated from nearby place");
                                                            }
                                                        } catch (error) {
                                                            toast.error("Could not fetch address details");
                                                        }
                                                        fetchNearbyPlaces(lat, lng);
                                                    }}
                                                    className="border border-gray-200 p-3 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition"
                                                >
                                                    <p className="font-medium text-gray-800 text-sm">{place.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{place.vicinity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Street Address Autocomplete */}
                                <AddressAutocompleteInput
                                    label="Street Address"
                                    name="street_address"
                                    value={streetValue}
                                    setValue={setStreetValue}
                                    suggestions={streetSuggestions}
                                    status={streetStatus}
                                    onSelect={handlePlaceSelect}
                                    placeholder="Enter street address"
                                    required={true}
                                    showCurrentButton={true}
                                    getCurrentLocation={getCurrentLocation}
                                    locationLoading={locationLoading}
                                    isLoaded={isLoaded}
                                    handleChange={handleChange}
                                />

                                {/* Landmark / Area - Now a standard manual input */}
                                <div className="w-full lg:w-6/12 px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Landmark / Area <span className="text-gray-400 text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={form.landmark}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                        placeholder="e.g. Near City Mall"
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Flat No - fully manual, optional */}
                                <div className="w-full lg:w-6/12 px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Flat / House No <span className="text-gray-400 text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="flatNo"
                                        value={form.flatNo}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                        placeholder="e.g. Flat 101, B-12"
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* State Dropdown */}
                                <div className="w-full lg:w-6/12 px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="state"
                                        value={selectedStateCode}
                                        onChange={handleStateChange}
                                        required
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select State</option>
                                        {statesList.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingStates && <span className="text-xs text-gray-400">Loading states...</span>}
                                </div>

                                {/* City Dropdown */}
                                <div className="w-full lg:w-6/12 px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="city"
                                        value={form.city}
                                        onChange={handleCityChange}
                                        required
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={!selectedStateCode}
                                    >
                                        <option value="">Select City</option>
                                        {citiesList.map((city, index) => (
                                            <option key={index} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingCities && <span className="text-xs text-gray-400">Loading cities...</span>}
                                </div>

                                {/* Pincode - fully manual */}
                                <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                        placeholder="6 digit pincode"
                                        maxLength={6}
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
                                        <option value="">Select Type</option>
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={modalMode === "add" ? handleAddAddress : updateAddress}
                                    disabled={loading}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                                >
                                    {loading
                                        ? modalMode === "add"
                                            ? "Adding..."
                                            : "Updating..."
                                        : modalMode === "add"
                                            ? "Save Address"
                                            : "Update Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}