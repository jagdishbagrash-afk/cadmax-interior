import Listing from '@/pages/api/Listing';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuillEditor from './ReactQuillEditor';

export default function Terms() {
    const [processing, setProcessing] = useState(false)

    const [data, setData] = useState({
        term_contdition: "",
    })


    const handleQuillChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const HomeLists = async () => {
        try {
            setProcessing(true);
            const main = new Listing();
            const response = await main.Privacy();
            const res = response?.data?.data;
            setData({
                term_contdition: res.term_contdition || "",
                _id: res?._id || ""
            });
        } catch (error) {
            console.log('error', error);
            setData([]);
        }
        setProcessing(false);
    };

    useEffect(() => {
        HomeLists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        try {
            const main = new Listing();
            const formData = new FormData();
            formData.append("term_contdition", data.term_contdition);
            formData.append("_id", data._id);
            const response = await main.HomeUpdate(formData);
            if (response) {
                HomeLists();
              toast.success("Terms & Conditions successfully updated");

            }
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message || "Something went wrong.";
            toast.error({
                401: "Unauthorized",
                403: "Access denied.",
                404: message,
                500: "Server error. Please try again later."
            }[status] || message);
        }
        setProcessing(false);
    };


    return (
        <div className=" mx-auto p-6 bg-white ">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Terms & Conditions */}

                <ReactQuillEditor
                    label={"Terms & Conditions"}
                    handleBioChange={(val) => handleQuillChange("term_contdition", val)}
                    desc={data.term_contdition}
                />

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        disabled={processing}
                        type="submit"
                        className="w-full max-w-[183px] cursor-pointer border border-[#CC2828] bg-[#000000] hover:bg-[#ffffff] hover:text-black  text-white py-2.5 lg:py-3.5 cursor-pointer rounded-[10px] font-normal text-base xl:text-xl transition  tracking-[-0.04em]"

                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}