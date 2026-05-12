import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Listing from "../api/Listing";
import Layout from "../common/Layout";
import ProductListBanner from "../../Assets/Images/vendor.png";
import Banner from "@/components/Banner";
import NoData from "../common/NoData";

export default function Index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.vendorcategoryList();
      setData(response?.data?.data || []);
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Banner
        Slider1={ProductListBanner}
        title={" "}
      />

      <div className="bg-[#FFFFFF] py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-[1430px]">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.map((p, idx) => (
              <Link
                href={`/vendor/${p.slug}`}
                key={p.id ?? idx}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">

                  {/* IMAGE */}
                  <div className="relative w-full h-[260px] md:h-[300px] overflow-hidden">
                    <img
                      src={p.Image}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 text-center">
                    <h3 className="text-[14px] md:text-[16px] font-semibold uppercase text-[#262A33] tracking-wide">
                      {p.name}
                    </h3>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          {/* 🔥 No Data */}
          {!data?.length && (
        <NoData Heading={"   No Vendor Categories Found !!"} />
          )}

        </div>
      </div>
    </Layout>
  );
}