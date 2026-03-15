import Layout from "../common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";
export default function Index() {
    const router = useRouter();
    const slug = router.query.slug;
    console.log("slug", slug)
    const [ProductDetail, setProductDetails] = useState([])
    const fetchData = async (slug) => {
        try {
            const main = new Listing();
            const response = await main.VendorCategoryList(slug);
            console.log("response", response)
            if (response.data?.data) {
                setProductDetails(response.data?.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    useEffect(() => {
        if (slug) fetchData(slug);
    }, [slug]);

    return (
        <Layout>
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden md:mt-[-80px]">

                <img
                    src={ProductDetail?.category?.Image}
                    alt="Slide"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/25"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <div className="space-y-2">
                        {/* SUBTITLE (Optional, adds professional touch) */}
                        <span className="text-white/80 text-[10px] sm:text-[12px] uppercase tracking-[0.3em] font-medium">
                            Verified Professionals
                        </span>

                        <h1 className="
                font-[900]
                text-[24px] 
                sm:text-[36px] 
                lg:text-[48px] 
                text-white 
                uppercase 
                leading-tight 
                tracking-tighter
                drop-shadow-lg
            ">
                            {ProductDetail?.category?.name}
                        </h1>

                        {/* DECORATIVE LINE */}
                        <div className="w-16 h-1 bg-red-600 mx-auto mt-2"></div>
                    </div>
                </div>
            </div>
          <div className="bg-[#f9fafb] py-6 md:py-10">
  <div className="container mx-auto px-4 max-w-[1430px]">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {ProductDetail?.vendors?.map((p, idx) => (

        <div
          key={p._id ?? idx}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
        >

          {/* Vendor Image */}
          <div className="bg-gray-50 flex flex-col items-center py-6 border-b">

            <div className="w-32 h-32 rounded-xl overflow-hidden border shadow">
              <img
                src={p.Image}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-800 uppercase tracking-wide text-center">
              {p.name}
            </h3>

            {/* Status Badge */}
            <span
              className={`mt-2 text-xs px-3 py-1 rounded-full font-semibold
              ${p.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {p.isAvailable ? "Available" : "Busy"}
            </span>

          </div>

          {/* Vendor Details */}
          <div className="p-5 flex flex-col gap-3 text-sm">

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">
                Experience
              </span>

              <span className="font-semibold text-gray-800">
                {p.experience} Years
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">
                Specialities
              </span>

              <span className="font-semibold text-gray-800 truncate max-w-[140px] text-right">
                {p.sepectailze || "General"}
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-3 p-5 pt-0">

            <button className="flex-1 border border-red-500 text-red-500 text-sm font-semibold py-2 rounded-lg hover:bg-red-50 transition">
              Work Photos
            </button>

            <button className="flex-1 bg-red-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-600 transition">
              Book Now
            </button>

          </div> */}

        </div>

      ))}

    </div>

  </div>
</div>

        </Layout>
    );
}