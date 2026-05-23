import { useEffect, useState } from "react";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { HiOutlineX } from "react-icons/hi";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import Listing from "../api/Listing";

function SearchPopup({ textColor }) {
    const router = useRouter();

    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");

    // API DATA
    const [products, setProducts] = useState([]);
    const [designs, setDesigns] = useState({});

    // LOADING
    const [loading, setLoading] = useState(false);

    /* SEARCH API */
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim().length >= 3) {
                fetchSearchData();
            } else {
                setProducts([]);
                setDesigns({});
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    /* FETCH SEARCH DATA */
    const fetchSearchData = async () => {
        try {
            setLoading(true);

            const main = new Listing();

            // API CALL
            // req.query.search backend me jayega
            const res = await main.globalSearch(search);

            console.log("SEARCH RESPONSE", res?.data);

            if (res?.data?.data) {
                setProducts(res?.data?.data?.products || {});
                setDesigns(res?.data?.data?.design || {});
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    /* SUBMIT SEARCH */
    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim().length < 3) {
            toast.error("Minimum 3 characters required");
            return;
        }

        router.push(`/product?search=${search}`);
        setSearchOpen(false);
    };

    /* REDIRECT */
    const handleRedirect = (slug, type) => {
        setSearchOpen(false);

        if (type === "design") {
            router.push(`/design/details/${slug}`);
        } else {
            router.push(`/product/details/${slug}`);
        }
    };

    // DESIGN ARRAY
 // DESIGN ARRAY
const allDesigns = [
    ...(designs?.modern || []),
    ...(designs?.classic || []),
    ...(designs?.contemporary || []),
    ...(designs?.common || []),
];
    return (
        <>
            {/* SEARCH BUTTON */}
            <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
                <FiSearch className={`${textColor} text-[22px]`} />
            </button>

            {/* SEARCH POPUP */}
            {searchOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">

                    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-2 py-2 border-b">
                            <h2 className="text-2xl font-bold text-black">
                                Search Products & Designs
                            </h2>

                            <button
                                onClick={() => setSearchOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                            >
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        {/* SEARCH INPUT */}
                        <div className="px-2 py-2 border-b">
                            <form
                                onSubmit={handleSearch}
                                className="relative"
                            >
                                <BsFillSearchHeartFill className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[22px]" />

                                <input
                                    type="text"
                                    placeholder="Search products or designs..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full h-[40px] pl-14 pr-4 rounded-2xl border border-gray-300 outline-none focus:border-black text-[16px]"
                                />
                            </form>

                            {/* MESSAGE */}
                            {search.length > 0 &&
                                search.length < 3 && (
                                    <p className="text-sm text-red-500 mt-2">
                                        Please enter minimum 3 characters
                                    </p>
                                )}
                        </div>

                        {/* RESULTS */}
                        <div className="max-h-[450px] overflow-y-auto">

                            {/* LOADING */}
                            {loading && (
                                <div className="p-10 text-center">
                                    <p className="text-gray-500">
                                        Searching...
                                    </p>
                                </div>
                            )}

                            {/* PRODUCTS */}
                            {/* PRODUCTS */}
                            {!loading && products?.length > 0 && (
                                <div className="p-5 border-b">

                                    <h3 className="text-xl font-semibold text-black mb-5">
                                        Products
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        {products.map((item, index) => {

                                            // PRODUCT IMAGE
                                            const productImage =
                                                item?.variants?.[0]?.images?.[0] ||
                                                item?.thumbnail ||
                                                item?.image ||
                                                "/noimage.png";

                                            // PRODUCT PRICE
                                            const productPrice =
                                                item?.variants?.[0]?.price ||
                                                item?.amount ||
                                                item?.price;

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        handleRedirect(
                                                            item?.slug,
                                                            "product"
                                                        )
                                                    }
                                                    className="group flex items-center gap-4 border rounded-2xl p-3 hover:shadow-xl hover:border-black cursor-pointer transition-all duration-300"
                                                >

                                                    {/* IMAGE */}
                                                    <div className="w-[50px] h-[50px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <Image
                                                            src={productImage}
                                                            alt={item?.title}
                                                            width={50}
                                                            height={50}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                                        />
                                                    </div>

                                                    {/* CONTENT */}
                                                    <div className="flex-1 min-w-0">

                                                        {/* TITLE */}
                                                        <h4 className="text-[17px] font-semibold text-black line-clamp-1">
                                                            {item?.title}
                                                        </h4>
                                                        {/* PRICE */}
                                                        {productPrice && (
                                                            <p className="text-black font-bold mt-1 text-[16px]">
                                                                ₹{productPrice}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* DESIGNS */}
                            {!loading &&
                                allDesigns?.length > 0 && (
                                    <div className="p-5">

                                        <h3 className="text-xl font-semibold text-black mb-5">
                                            Designs
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                            {allDesigns.map((item, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        handleRedirect(
                                                            item?.slug,
                                                            "design"
                                                        )
                                                    }
                                                    className="flex items-center gap-4 border rounded-2xl p-3 hover:shadow-lg hover:border-black cursor-pointer transition-all duration-300"
                                                >
                                                    <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <Image
                                                            src={
                                                                item?.Image ||
                                                                item?.multiple_images[0] ||
                                                                "/CADMAX.png"
                                                            }
                                                            alt={item?.title}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <h4 className="text-[16px] font-semibold text-black line-clamp-1">
                                                            {item?.title}
                                                        </h4>

                                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                                            {item?.concept || "Design"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* NO RESULT */}
                            {!loading &&
                                search.length >= 3 &&
                                products?.length === 0 &&
                                allDesigns?.length === 0 && (
                                    <div className="p-12 text-center">

                                        <h3 className="text-xl font-semibold text-gray-700">
                                            No Results Found
                                        </h3>

                                        <p className="text-gray-500 mt-2">
                                            Try another keyword
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SearchPopup;