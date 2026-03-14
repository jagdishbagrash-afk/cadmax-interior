import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import { router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function EditAddress({ item, statelist, setAddress }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };




    const { data, setData, errors, post, reset, } = useForm({
        address_type: item?.address_type || '',
        street_address: item?.street_address || '',
        zipcode: item?.zipcode || '',
        state: item?.state_id || '',
        city: item?.city_id || '',
        country: item?.country_id || '',
        id: item?.user_id,
        uuid: item?.uuid,

    });

    useEffect(() => {
        if (open) {
            reset({
                address_type: item?.address_type || '',
                street_address: item?.street_address || '',
                zipcode: item?.zipcode || '',
                state: item?.state_id || '',
                city: item?.city_id || '',
                country: item?.country_id || '',
                id: item?.user_id,
                uuid: item?.uuid,
            });
        }
    }, [open, item, reset]);
    const HandleEditAddress = (uuid) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("address_type", data.address_type);
        formData.append("state", data.state);
        formData.append("city", data.city);
        formData.append("zipcode", data.zipcode);
        formData.append("country", data.country);
        formData.append("street_address", data.street_address);
        formData.append("uuid", data?.uuid);
        axios.post(route("address.update"), formData)
            .then((response) => {
                if (response?.data?.success) {
                    setAddress(response?.data?.data)
                    toast.success(response?.data?.message, {
                        duration: 3000
                    });
                    handleClose();
                } else {
                    toast.error(response?.data?.message);
                }
                setProcessing(false);

            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error(error?.response?.data?.message);
                setProcessing(false);

            });
    };




    const [ServiceCities, setServiceCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServiceAreas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/service-areas/${data?.state}`);
            setServiceCities(response.data?.cities);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data?.state) {
            fetchServiceAreas();
        }

    }, [data?.state]);

    const [zipcode, setZipcode] = useState([])
    const fetchServicecities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/service-areas/${data?.state}/${data?.city}`);
            setZipcode(response.data?.zipcodes);
        } catch (err) {
            // console.log("error", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data?.state || data?.city) {
            fetchServicecities();
        }

    }, [data?.state, data?.city])
    return (
        <>
            <button
                onClick={handleOpen}
                className="text-white bg-[#0367F7] hover:text-[#0367F7] hover:bg-white text-sm font-medium tracking-[-0.03em] h-8 lg:h-[41px] px-8 border border-[#0367F7] rounded-full outline-none focus:outline-none ease-linear transition-all duration-150"
            >
                Edit
            </button>

            <Modal show={open} className="shadow-none">
                <div className="relative bg-white w-full rounded-[30px] lg:rounded-[40px] h-auto m-auto">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="absolute top-5 md:top-6 lg:top-9 right-6 lg:right-10 text-gray-700 hover:text-gray-900"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="border-b border-black border-opacity-10 pt-6 pb-5 px-6 lg:pt-8 lg:pb-6 lg:px-10">
                        <h2 className="text-xl lg:text-2xl text-[#212121] tracking-[-0.04em] font-semibold mb-0">Edit Address</h2>
                    </div>

                    <div className="p-6 lg:p-10">
                        <div className="flex flex-wrap -mx-2.5">
                            <div className="w-full px-2.5 mb-3 lg:mb-6">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="street_address"
                                    value={data.street_address}
                                    onChange={(e) => setData('street_address', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                />
                                <InputError message={errors.street_address} className="!text-red-600" />
                            </div>

                            <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">Address Type</label>
                                <input
                                    type="text"
                                    name="address_type"
                                    value={data.address_type}
                                    onChange={(e) => setData('address_type', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                />
                                <InputError message={errors.address_type} className="!text-red-600" />
                            </div>

                            <div className="w-full lg:w-6/12 mb-3 lg:mb-6 px-2.5">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">Country</label>
                                <select
                                    name="country"
                                    value={data?.country}
                                    required
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                >
                                    <option value="">Select Country</option>
                                    <option value="1">USA</option>
                                </select>
                                <InputError message={errors.country_id} className="!text-red-600" />
                            </div>

                            <div className="w-full lg:w-4/12 mb-3 lg:mb-6 px-2.5">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">State</label>

                                <select
                                    name="state"
                                    value={data?.state}
                                    required
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                >
                                    <option value="">Select State</option>
                                    {statelist && statelist?.map((item, index) => (
                                        <option key={index} value={item?.id}>{item?.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.state_id} className="!text-red-600" />
                            </div>

                            <div className="w-full lg:w-4/12 mb-3 lg:mb-6 px-2.5">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">City</label>
                                <select
                                    name="city"
                                    required
                                    value={data?.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                >
                                    <option value="">Select City</option>
                                    {ServiceCities && ServiceCities?.map((item, index) => (
                                        <option key={index} value={item?.id}>{item?.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.city_id} className="!text-red-600" />
                            </div>

                            <div className="w-full lg:w-4/12 mb-3 lg:mb-6 px-2.5">
                                <label className="font-medium text-sm lg:text-base tracking-[-0.03em] block text-[#8D929A] mb-1 lg:mb-2">Zip Code</label>
                                <select
                                    name="zipcode"
                                    required
                                    value={data?.zipcode}
                                    onChange={(e) => setData('zipcode', e.target.value)}
                                    className="w-full h-11 lg:h-[54px] font-semibold appearance-none block bg-white text-[#46494D] text-base border border-gray-300 rounded-lg py-3 px-3 lg:px-5 leading-tight focus:outline-none"
                                >
                                    <option value="">Select Zipcode</option>
                                    {zipcode && zipcode?.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                                <InputError message={errors.zipcode} className="!text-red-600" />
                            </div>
                        </div>

                        <div className="flex justify-end mt-3 lg:mt-6">
                            <button
                                className="text-white bg-[#0367F7] hover:text-[#0367F7] hover:bg-white text-sm font-medium tracking-[-0.03em] h-11 lg:h-[54px] px-12 border border-[#0367F7] rounded-full outline-none focus:outline-none ease-linear transition-all duration-150"
                                onClick={HandleEditAddress}
                                disabled={processing}
                            >
                                {processing ? "Processing.." : "Update Address"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default EditAddress;
