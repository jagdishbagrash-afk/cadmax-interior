import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Listing from '@/pages/api/Listing';

export default function AdminManage() {
    const [processing, setProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [data, setData] = useState({
        admin_comission: '',
        _id: '',
    });

    useEffect(() => {
        setMounted(true);
        HomeLists();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const HomeLists = async () => {
        try {
            setProcessing(true);
            const main = new Listing();
            const response = await main.Privacy();
            const res = response?.data?.data;
            setData({
                admin_comission: res?.admin_comission || '',
                _id: res?._id || '',
            });
        } catch (error) {
            toast.error('Failed to load data.');
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        try {
            const main = new Listing();
            const formData = new FormData();
            formData.append('admin_comission', data.admin_comission);
            formData.append('_id', data._id);
            const response = await main.HomeUpdate(formData);
            toast.success(response.data.message || 'Updated successfully!');
        } catch (error) {
            const status = error?.response?.status;
            toast.error({
                401: 'Unauthorized',
                403: 'Access denied.',
                404: 'Not found.',
                500: 'Server error.',
            }[status] || 'Something went wrong.');
        } finally {
            setProcessing(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="mx-auto py-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[#000000] font-medium text-base xl:text-xl mb-1 tracking-[-0.04em]">
                       Processing fee (%)
                    </label>
                    <input
                        type="number"
                        name="admin_comission"
                        value={data.admin_comission}
                        onChange={handleChange}
                        placeholder="Enter  Processing fee"
                        className="w-full h-11 lg:h-[54px] bg-[#F4F6F8] text-[#46494D] text-base border border-[#F4F6F8] rounded-lg py-3 px-3 lg:px-6"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full max-w-[183px] bg-[#000000] cursor-pointer hover:bg-[#ffffff] hover:text-black text-white py-2.5 lg:py-3.5 rounded-[10px] text-base xl:text-xl"
                    >
                        {processing ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
