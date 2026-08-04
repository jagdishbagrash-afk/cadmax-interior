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

// ---------- Address Input Field Component (Outside Main Component to prevent focus loss) ----------
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
    handleChange
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
                    setValue(e.target.value); // Triggers Google Places API on typing
                    if (handleChange) {
                        handleChange(e);
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
    const [addAddress, setAddAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    // ---- Nearby places states ----
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [showNearby, setShowNearby] = useState(false);
    const mapRef = useRef(null); // Google Map instance

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

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

    // --- Places Autocomplete for Landmark / Area (Multiple Search) ---
    const {
        ready: landmarkReady,
        value: landmarkValue,
        suggestions: { status: landmarkStatus, data: landmarkSuggestions },
        setValue: setLandmarkValue,
        clearSuggestions: clearLandmarkSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: { componentRestrictions: { country: "in" } },
        debounce: 300,
        cache: 86400,
    });

    const [form, setForm] = useState({
        street_address: "",
        flatNo: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        addressType: "",
    });

    // ---------- Fetch Addresses ----------
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

    // ---------- Input Change ----------
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ---------- Fill form from place details ----------
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

        setStreetValue(street, false);
        clearStreetSuggestions();
        clearLandmarkSuggestions();
    };

    // ---------- Nearby Search (Places API) ----------
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

    // ---------- Reverse geocode and fill form + fetch nearby ----------
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

    // ---------- Map onLoad ----------
    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    // ---------- Marker drag handler ----------
    const onMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPos({ lat, lng });
        setMapCenter({ lat, lng });
        reverseGeocodeAndFill(lat, lng);
    };

    // ---------- Map click handler ----------
    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPos({ lat, lng });
        setMapCenter({ lat, lng });
        reverseGeocodeAndFill(lat, lng);
    };

    // ---------- Common function to handle address selection from any autocomplete ----------
    const handlePlaceSelect = async (address, setValueFunc, clearSuggestionsFunc) => {
        setValueFunc(address, false);
        clearSuggestionsFunc();
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

    // ---------- Get Current Location ----------
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

    // ---------- Add / Update / Delete / Default ----------
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
            setAddAddress(false);
            setForm({
                street_address: "",
                flatNo: "",
                city: "",
                state: "",
                country: "India",
                pincode: "",
                addressType: "",
            });
            setStreetValue("", false);
            setLandmarkValue("", false);
            clearStreetSuggestions();
            clearLandmarkSuggestions();
            setMarkerPos(defaultCenter);
            setMapCenter(defaultCenter);
            setNearbyPlaces([]);
            setShowNearby(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
    };

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

    const handleEdit = (item) => {
        setForm({
            street_address: item.street_address || "",
            flatNo: item.flatNo || "",
            city: item.city || "",
            state: item.state || "",
            country: item.country || "India",
            pincode: item.pincode || "",
            addressType: item.addressType || "",
        });
        setEditId(item._id);
        setEditOpen(true);
        setStreetValue(item.street_address || "", false);
        setLandmarkValue("", false);
        clearStreetSuggestions();
        clearLandmarkSuggestions();
        setShowNearby(false);
    };

    // ---------- Map Component ----------
    const AddressMap = () => (
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
    );

    // ---------- Nearby Places UI ----------
    const NearbyList = () => {
        if (!showNearby || nearbyPlaces.length === 0) return null;
        return (
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
        );
    };

    // ---------- Error state ----------
    if (loadError) {
        return (
            <Layout heading="Manage Address">
                <div className="bg-red-50 p-6 rounded-xl text-center text-red-600">
                    Error loading Google Maps. Please check your API key.
                </div>
            </Layout>
        );
    }

    // ---------- Main Render ----------
    return (
        <Layout heading="Manage Address">
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Addresses</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setAddAddress(!addAddress)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
                            >
                                {addAddress ? "Cancel" : "+ Add Address"}
                            </button>
                        </div>
                    </div>

                    {/* Address List */}
                    <div className="space-y-4">
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
                                                <p className="text-gray-500 text-sm mt-1">{item.addressType}</p>
                                                <p className="text-gray-600 text-sm break-words">
                                                    {item.city}, {item.state}, {item.country} - {item.pincode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center gap-4 flex-shrink-0 w-full sm:w-auto">
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

                    {/* ---------- Add Address Form ---------- */}
                    {addAddress && (
                        <div className="bg-white mt-8 border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-6">Add New Address</h3>
                            <div className="flex flex-wrap -mx-2.5">
                                {/* Map */}
                                <AddressMap />

                                {/* Nearby Places List */}
                                <NearbyList />

                                {/* Street Address Autocomplete */}
                                <AddressAutocompleteInput
                                    label="Street Address"
                                    name="street_address"
                                    value={streetValue}
                                    setValue={setStreetValue}
                                    suggestions={streetSuggestions}
                                    status={streetStatus}
                                    onSelect={(address) => handlePlaceSelect(address, setStreetValue, clearStreetSuggestions)}
                                    placeholder="Enter street address"
                                    required={true}
                                    showCurrentButton={true}
                                    getCurrentLocation={getCurrentLocation}
                                    locationLoading={locationLoading}
                                    isLoaded={isLoaded}
                                    handleChange={handleChange}
                                />

                                {/* Landmark / Area Autocomplete */}
                                <AddressAutocompleteInput
                                    label="Landmark / Area (Optional)"
                                    name="landmark"
                                    value={landmarkValue}
                                    setValue={setLandmarkValue}
                                    suggestions={landmarkSuggestions}
                                    status={landmarkStatus}
                                    onSelect={(address) => handlePlaceSelect(address, setLandmarkValue, clearLandmarkSuggestions)}
                                    placeholder="Search landmark or area"
                                    required={false}
                                    showCurrentButton={false}
                                />

                                {/* Flat No */}
                                <div className="w-full lg:w-6/12 px-2.5 mb-3 lg:mb-6">
                                    <label className="font-medium text-sm lg:text-base text-[#8D929A] mb-2 block">
                                        Flat / House No <span className="text-gray-400 text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="flatNo"
                                        value={form.flatNo}
                                        onChange={handleChange}
                                        placeholder="e.g. Flat 101, B-12"
                                        className="w-full h-11 lg:h-[54px] font-semibold bg-white text-[#46494D] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* City, State, Country via InputBox */}
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
                                        <option value="">Select Type</option>
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    onClick={handleAddAddress}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {loading ? "Adding..." : "Save Address"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ---------- Edit Modal ---------- */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-6">Edit Address</h3>
                        <div className="space-y-4">
                            {/* Map in Modal */}
                            <div className="w-full">
                                <label className="font-medium text-sm text-[#8D929A] mb-1 block">
                                    Pick location on map
                                </label>
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={{
                                            width: "100%",
                                            height: "200px",
                                            borderRadius: "8px",
                                        }}
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
                                    <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                        Loading map...
                                    </div>
                                )}
                            </div>

                            <NearbyList />

                            {/* Street Address */}
                            <AddressAutocompleteInput
                                label="Street Address"
                                name="street_address"
                                value={streetValue}
                                setValue={setStreetValue}
                                suggestions={streetSuggestions}
                                status={streetStatus}
                                onSelect={(address) => handlePlaceSelect(address, setStreetValue, clearStreetSuggestions)}
                                placeholder="Enter street address"
                                required={true}
                                showCurrentButton={true}
                                getCurrentLocation={getCurrentLocation}
                                locationLoading={locationLoading}
                                isLoaded={isLoaded}
                                handleChange={handleChange}
                            />

                            {/* Landmark */}
                            <AddressAutocompleteInput
                                label="Landmark / Area"
                                name="landmark"
                                value={landmarkValue}
                                setValue={setLandmarkValue}
                                suggestions={landmarkSuggestions}
                                status={landmarkStatus}
                                onSelect={(address) => handlePlaceSelect(address, setLandmarkValue, clearLandmarkSuggestions)}
                                placeholder="Search landmark or area"
                                required={false}
                                showCurrentButton={false}
                            />

                            {/* Flat No */}
                            <div>
                                <label className="font-medium text-sm text-[#8D929A] mb-1 block">
                                    Flat / House No <span className="text-gray-400 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="flatNo"
                                    value={form.flatNo}
                                    onChange={handleChange}
                                    placeholder="e.g. Flat 101, B-12"
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <InputBox data={form} handleChange={handleChange} />

                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="Pincode"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                name="addressType"
                                value={form.addressType}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Address Type</option>
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setEditOpen(false);
                                    setStreetValue("", false);
                                    setLandmarkValue("", false);
                                    clearStreetSuggestions();
                                    clearLandmarkSuggestions();
                                    setShowNearby(false);
                                }}
                                className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateAddress}
                                disabled={loading}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
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