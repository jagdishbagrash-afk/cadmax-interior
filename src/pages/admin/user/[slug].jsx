"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (id) => {
    try {
      const main = new Listing();
      const response = await main.AddressUser(id);

      if (response?.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && slug) {
      fetchData(slug);
    }
  }, [router.isReady, slug]);

  return (
    <AdminLayout page={"User Address Listing"}>
      <div className="p-4">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
              User Address List
            </h2>

            <Link
              href="/admin/user"
              className="text-sm px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              ← Back
            </Link>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">

              {/* HEAD */}
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr className="text-center">
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Pincode</th>
                  <th className="px-6 py-3">Default</th>
                  <th className="px-6 py-3">Type</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y">

                {/* LOADING */}
                {loading && (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400">
                      Loading Address...
                    </td>
                  </tr>
                )}

                {/* DATA */}
                {!loading && data.length > 0 &&
                  data.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-6 py-4 text-center font-medium">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 text-left max-w-[250px] truncate">
                        {item.street_address}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.state}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.city}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.pincode}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold
                          ${
                            item.isDefault
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.isDefault ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center capitalize">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                          {item.addressType}
                        </span>
                      </td>
                    </tr>
                  ))}

                {/* EMPTY */}
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      No Address Found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}