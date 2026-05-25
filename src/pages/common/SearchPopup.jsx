import { useEffect, useRef, useState } from "react";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { HiOutlineX } from "react-icons/hi";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import Listing from "../api/Listing";

function SearchPopup({ textColor = "text-black" }) {
    const router = useRouter();
    const inputRef = useRef(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");

    // API DATA
    const [products, setProducts] = useState([]);
    const [designs, setDesigns] = useState({});

    // LOADING
    const [loading, setLoading] = useState(false);

    // AUTO FOCUS
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [searchOpen]);

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
            const res = await main.globalSearch(search);

            if (res?.data?.data) {
                setProducts(res?.data?.data?.products || []);
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
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-black/5 transition-all duration-300"
            >
                <FiSearch className={`${textColor} text-[22px]`} />
            </button>

            {/* SEARCH POPUP */}
            {searchOpen && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-start justify-center px-4 py-10 animate-fadeIn">

                    {/* POPUP */}
                    <div className="w-full md:max-w-5xl bg-white rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.25)] overflow-hidden border border-gray-200">

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-2 py-3 md:px-8 md:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">

                            <div>
                                <span className="text-[14px] md:text-[26px] font-semibold text-black">
                                    Search Products & Designs
                                </span>

                                <p className="text-[10px] md:text-sm text-gray-500 mt-1">
                                    Find premium products and interior designs
                                </p>
                            </div>

                            <button
                                onClick={() => setSearchOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300"
                            >
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        {/* SEARCH INPUT */}
                        <div className="px-4 md:px-8 py-3 md:py-5 border-b border-gray-100 bg-white">

                            <form
                                onSubmit={handleSearch}
                                className="relative"
                            >
                                <BsFillSearchHeartFill className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[22px]" />

                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search products, categories, designs..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full h-[30px] md:h-[62px] pl-14 pr-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-black focus:ring-4 focus:ring-black/5 text-[17px] font-medium transition-all duration-300"
                                />
                            </form>

                            {/* MESSAGE */}
                            {search.length > 0 &&
                                search.length < 3 && (
                                    <p className="text-sm text-red-500 mt-3">
                                        Please enter at least 3 characters
                                    </p>
                                )}
                        </div>

                        {/* RESULTS */}
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">

                            {/* LOADING */}
                            {loading && (
                                <div className="py-20 flex flex-col items-center justify-center">

                                    <div className="w-12 h-12 border-[3px] border-gray-200 border-t-black rounded-full animate-spin"></div>

                                    <p className="text-gray-500 mt-5 text-lg">
                                        Searching...
                                    </p>
                                </div>
                            )}

                            {/* PRODUCTS */}
                            {!loading && products?.length > 0 && (
                                <div className="p-4  md:p-8 border-b border-gray-100">

                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-black">
                                            Products
                                        </h3>

                                        <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                                            {products?.length} Results
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

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
                                                    className="group bg-white border border-gray-200 rounded-3xl p-4 hover:border-black hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                                                >

                                                    <div className="flex items-center gap-4">

                                                        {/* IMAGE */}
                                                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                            <Image
                                                                src={productImage}
                                                                alt={item?.title}
                                                                width={90}
                                                                height={90}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                                                            />
                                                        </div>

                                                        {/* CONTENT */}
                                                        <div className="flex-1 min-w-0">

                                                            {/* TITLE */}
                                                            <h4 className="text-[18px] font-semibold text-black line-clamp-2 leading-[28px]">
                                                                {item?.title}
                                                            </h4>

                                                            {/* PRICE */}
                                                            {productPrice && (
                                                                <p className="text-black font-bold mt-3 text-[18px]">
                                                                    ₹{productPrice}
                                                                </p>
                                                            )}

                                                            <button className="mt-3 text-sm font-medium text-black underline underline-offset-4">
                                                                View Details
                                                            </button>
                                                        </div>
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
                                    <div className="p-4 md:p-8">

                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-black">
                                                Designs
                                            </h3>

                                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                                {allDesigns?.length} Results
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                            {allDesigns.map((item, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        handleRedirect(
                                                            item?.slug,
                                                            "design"
                                                        )
                                                    }
                                                    className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-black hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                                                >

                                                    {/* IMAGE */}
                                                    <div className="relative w-full h-[220px] overflow-hidden">
                                                        <Image
                                                            src={
                                                                item?.Image ||
                                                                item?.multiple_images?.[0] ||
                                                                "/CADMAX.png"
                                                            }
                                                            alt={item?.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-all duration-700"
                                                        />

                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                                                        <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-black text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                                            {item?.concept || "Design"}
                                                        </span>
                                                    </div>

                                                    {/* CONTENT */}
                                                    <div className="p-5">

                                                        <h4 className="text-[18px] font-semibold text-black line-clamp-2 leading-[30px]">
                                                            {item?.title}
                                                        </h4>

                                                        <button className="mt-4 text-sm font-medium text-black underline underline-offset-4">
                                                            Explore Design
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* EMPTY STATE */}
                            {!loading &&
                                search.length >= 3 &&
                                products?.length === 0 &&
                                allDesigns?.length === 0 && (
                                    <div className="py-24 px-6 text-center">

                                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                                            <FiSearch className="text-[40px] text-gray-400" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 mt-6">
                                            No Results Found
                                        </h3>

                                        <p className="text-gray-500 mt-3 text-lg">
                                            Try searching with another keyword
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