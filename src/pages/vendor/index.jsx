import Head from "next/head";
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
    <>
      <Head>
        <title>
          Construction & Interior Design Vendors in Jaipur | CADMAX Atelier
        </title>

        <meta
          name="description"
          content="Partner with CADMAX Atelier as a verified vendor in Jaipur. Register your business for architecture, construction, interior design, furniture, lighting, décor, building materials, landscaping, and luxury project collaborations."
        />

        <meta
          name="keywords"
          content="Vendor Registration Jaipur, Construction Vendors Jaipur, Interior Design Vendors, Architecture Vendors, Furniture Suppliers Jaipur, Building Material Suppliers, Lighting Suppliers Jaipur, Décor Suppliers, Home Improvement Vendors, Civil Contractors Jaipur, Interior Contractors, Landscaping Services Jaipur, Construction Partner, CADMAX Atelier Vendor"
        />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="CADMAX Atelier" />

        <link
          rel="canonical"
          href="https://cadmaxatelier.com/vendor"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Construction & Interior Design Vendors in Jaipur | CADMAX Atelier"
        />

        <meta
          property="og:description"
          content="Join CADMAX Atelier's trusted vendor network for architecture, construction, interior design, furniture, lighting, décor, and building material projects."
        />

        <meta
          property="og:url"
          content="https://cadmaxatelier.com/vendor"
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:site_name"
          content="CADMAX Atelier"
        />

        <meta
          property="og:image"
          content="https://cadmaxatelier.com/logo.png"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Construction & Interior Design Vendors in Jaipur | CADMAX Atelier"
        />

        <meta
          name="twitter:description"
          content="Become a trusted vendor partner with CADMAX Atelier and collaborate on premium architecture, construction, and interior design projects."
        />

        <meta
          name="twitter:image"
          content="https://cadmaxatelier.com/logo.png"
        />
      </Head>
      <Layout>
        <h1
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Become a Trusted Vendor Partner
        </h1>
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
    </>

  );
}