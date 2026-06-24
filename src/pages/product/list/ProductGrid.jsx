import Loader from "@/components/Loader";
import Listing from "@/pages/api/Listing";
import NoData from "@/pages/common/NoData";
import ProductCard from "@/pages/common/ProductCard";
import { useEffect, useRef, useState, useCallback } from "react";
import { FiChevronDown, FiX, FiSliders, FiDroplet } from "react-icons/fi";

const ProductGrid = ({ selectedId }) => {
    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState("");

    const [selectedColors, setSelectedColors] = useState([]);
    const [color, setColor] = useState([]);

    const [priceLimits, setPriceLimits] = useState({
        min: 0,
        max: 0,
    });

    const [priceRange, setPriceRange] = useState({
        low: 0,
        high: 0,
    });

    const [colorExpanded, setColorExpanded] = useState(true);
    const [sortExpanded, setSortExpanded] = useState(true);
    const [priceExpanded, setPriceExpanded] = useState(true);

    const priceDebounceRef = useRef(null);
    const prevFilterRef = useRef("");

    // ================= FETCH FILTER DATA =================
    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetAllProdcuctColor();
            if (response?.data?.data) {
                const min = response.data.data.lowestPrice ?? 0;
                const max = response.data.data.highestPrice ?? 0;

                setColor(response.data.data.colors || []);

                setPriceLimits({ min, max });

                setPriceRange({
                    low: min,
                    high: max,
                });
            } else {
                setColor([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setColor([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= FETCH PRODUCTS =================
    const fetchProjectData = useCallback(async (
        pageNo = 1,
        reset = false,
        customFilters = null
    ) => {
        try {
            setLoading(true);

            const filters =
                customFilters || {
                    ...(selectedColors.length > 0 && {
                        color: selectedColors.join(","),
                    }),
                    lowPrice: priceRange.low,
                    highPrice: priceRange.high,
                    sortBy,
                };

            const main = new Listing();

            const response =
                await main.getAllProductSubCategroy(
                    selectedId,
                    pageNo,
                    limit,
                    filters
                );

            const resData = response?.data?.data;

            const newProducts = resData?.data || [];

            const pagination = resData?.pagination || {};

            if (reset) {
                setProducts(newProducts);
            } else {
                setProducts((prev) => [
                    ...prev,
                    ...newProducts,
                ]);
            }

            setHasMore(
                pagination.page < pagination.totalPages
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [selectedId, selectedColors, priceRange, sortBy, limit]);

    // ================= INIT LOAD =================
    useEffect(() => {
        if (!selectedId) return;

        setProducts([]);
        setPage(1);
        setHasMore(true);

        fetchProjectData(1, true);
    }, [selectedId, fetchProjectData]);

    // ================= FILTER CHANGE (single trigger) =================
    useEffect(() => {
        if (!selectedId) return;

        // Generate a string key from current filters
        const filterKey = JSON.stringify({
            colors: selectedColors,
            price: priceRange,
            sortBy,
        });
        // Skip if filter hasn't actually changed (prevents double calls)
        if (prevFilterRef.current === filterKey) return;
        prevFilterRef.current = filterKey;

        setProducts([]);
        setPage(1);
        setHasMore(true);

        fetchProjectData(1, true);
    }, [selectedColors, priceRange, selectedId, sortBy, fetchProjectData]);

    const getItemPrice = (item) => {
        // Match the same logic as getProductPrices helper
        if (Number(item?.final_amount) > 0) return Number(item.final_amount);
        const sections = item?.product_price_section;
        if (sections?.length > 0) {
            const first = sections[0];
            if (first?.sizes?.length > 0) return Number(first.sizes[0]?.final_amount) || Number(first.sizes[0]?.amount) || 0;
            return Number(first?.final_amount) || Number(first?.amount) || 0;
        }
        return Number(item?.amount) || Number(item?.salePrice) || Number(item?.price) || 0;
    };

    const sortedProducts = [...products].sort((a, b) => {
        const priceA = getItemPrice(a);
        const priceB = getItemPrice(b);

        if (sortBy === "lowToHigh") {
            return priceA - priceB;
        }

        if (sortBy === "highToLow") {
            return priceB - priceA;
        }

        return 0;
    });

    // ================= COLOR FILTER =================
    const handleColorChange = (selectedColor) => {
        setSelectedColors((prev) => {
            if (prev.includes(selectedColor)) {
                return prev.filter((c) => c !== selectedColor);
            }
            return [...prev, selectedColor];
        });
    };

    // ================= PRICE FILTER (DEBOUNCE - NO DUPLICATE) =================
    const handlePriceChange = (type, value) => {
        value = Number(value);

        // Update state immediately for UI responsiveness
        setPriceRange((prev) => {
            const updated = { ...prev };
            if (type === "low") updated.low = value;
            if (type === "high") updated.high = value;
            return updated;
        });

        // Debounce API call - the useEffect will handle the actual fetch
        if (priceDebounceRef.current) {
            clearTimeout(priceDebounceRef.current);
        }
        
        priceDebounceRef.current = setTimeout(() => {
            prevFilterRef.current = ""; // Reset so useEffect triggers
            setPriceRange((currentRange) => {
                // Use functional update to get latest value
                const newRange = { ...currentRange };
                return newRange;
            });
        }, 500);
    };

    // ================= CLEAR FILTER =================
    const handleClearFilters = () => {
        const resetRange = {
            low: priceLimits.min,
            high: priceLimits.max,
        };

        setSelectedColors([]);
        setPriceRange(resetRange);
        prevFilterRef.current = ""; // Reset filter key

        setProducts([]);
        setPage(1);
        setHasMore(true);

        fetchProjectData(
            1,
            true,
            {
                lowPrice: resetRange.low,
                highPrice: resetRange.high,
            }
        );
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;

        setPage(nextPage);

        fetchProjectData(nextPage);
    };

    const range = priceLimits.max - priceLimits.min || 1;

    const leftPercent =
        ((priceRange.low - priceLimits.min) / range) * 100;

    const widthPercent =
        ((priceRange.high - priceRange.low) / range) * 100;

    const isInitialLoading = loading && products.length === 0;

    const hasActiveFilters = selectedColors.length > 0 || priceRange.low !== priceLimits.min || priceRange.high !== priceLimits.max;

    return (
        <>
            <div className="w-full px-4 md:px-10 lg:px-14 py-4 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">

                    {/* ================= FILTER PANEL ================= */}
                    <div className="order-2 md:order-1">
                        <div className="bg-white p-5 md:p-7 sticky top-24 h-max space-y-6 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

                            {/* FILTER HEADER */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                                        <FiSliders size={14} className="text-white" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-900">
                                        Filters
                                    </h3>
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                                    >
                                        <FiX size={12} />
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* COLOR FILTER */}
                            <div className="border-b border-gray-100 pb-6">
                                <button
                                    onClick={() => setColorExpanded(!colorExpanded)}
                                    className="flex items-center justify-between w-full group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <FiDroplet size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                                        <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-800">
                                            Color
                                        </h4>
                                    </div>
                                    <FiChevronDown
                                        size={14}
                                        className={`text-gray-400 transition-transform duration-300 ${colorExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {colorExpanded && (
                                    <div className="mt-5 grid grid-cols-4 gap-3">
                                        {color?.map((c, i) => {
                                            const isSelected = selectedColors.includes(c);
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleColorChange(c)}
                                                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
                                                        isSelected
                                                            ? "bg-gray-50 ring-1 ring-gray-900/10"
                                                            : "hover:bg-gray-50/50"
                                                    }`}
                                                    title={c}
                                                >
                                                    <div className="relative">
                                                        <div
                                                            className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                                                                isSelected
                                                                    ? "border-gray-900 scale-110 shadow-sm"
                                                                    : "border-gray-200 group-hover:border-gray-300"
                                                            }`}
                                                            style={{ backgroundColor: c }}
                                                        />
                                                        {isSelected && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[9px] uppercase tracking-wider font-medium truncate max-w-full ${
                                                        isSelected ? "text-gray-900" : "text-gray-500"
                                                    }`}>
                                                        {c}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* SORT BY FILTER */}
                            <div className="border-b border-gray-100 pb-6">
                                <button
                                    onClick={() => setSortExpanded(!sortExpanded)}
                                    className="flex items-center justify-between w-full group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-700 transition-colors">
                                            <line x1="16" y1="2" x2="16" y2="22" />
                                            <polyline points="20 6 16 2 12 6" />
                                            <line x1="8" y1="22" x2="8" y2="2" />
                                            <polyline points="4 18 8 22 12 18" />
                                        </svg>
                                        <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-800">
                                            Sort By
                                        </h4>
                                    </div>
                                    <FiChevronDown
                                        size={14}
                                        className={`text-gray-400 transition-transform duration-300 ${sortExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {sortExpanded && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {[
                                            { value: "lowToHigh", label: "Low → High" },
                                            { value: "highToLow", label: "High → Low" },
                                        ].map((opt) => {
                                            const isActive = sortBy === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSortBy(opt.value)}
                                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* PRICE RANGE FILTER */}
                            <div>
                                <button
                                    onClick={() => setPriceExpanded(!priceExpanded)}
                                    className="flex items-center justify-between w-full group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-700 transition-colors">
                                            <path d="M6 3h10.5a3.5 3.5 0 0 1 0 7H6" />
                                            <path d="M6 10h5a3.5 3.5 0 0 1 0 7H6" />
                                            <line x1="8" y1="3" x2="8" y2="17" />
                                            <line x1="8" y1="20" x2="8" y2="23" />
                                        </svg>
                                        <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-800">
                                            Price Range
                                        </h4>
                                    </div>
                                    <FiChevronDown
                                        size={14}
                                        className={`text-gray-400 transition-transform duration-300 ${priceExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {priceExpanded && (
                                    <div className="mt-5 space-y-5">
                                        {/* Price Labels */}
                                        <div className="flex items-center justify-between">
                                            <div className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
                                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Min</span>
                                                <p className="text-sm font-bold text-gray-900">₹{Number(priceRange.low).toLocaleString("en-IN")}</p>
                                            </div>
                                            <div className="w-3 h-px bg-gray-300" />
                                            <div className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-right">
                                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Max</span>
                                                <p className="text-sm font-bold text-gray-900">₹{Number(priceRange.high).toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>

                                        {/* Custom Range Slider */}
                                        <div className="relative h-8">
                                            {/* Track Background */}
                                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
                                            
                                            {/* Active Track */}
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 h-1 bg-gray-900 rounded-full"
                                                style={{
                                                    left: `${leftPercent}%`,
                                                    width: `${widthPercent}%`,
                                                }}
                                            />

                                            {/* Min Range Input */}
                                            <input
                                                type="range"
                                                min={priceLimits.min}
                                                max={priceLimits.max}
                                                value={priceRange.low}
                                                onChange={(e) =>
                                                    handlePriceChange("low", e.target.value)
                                                }
                                                className="absolute w-full top-0 h-8 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                                                style={{ zIndex: priceRange.low > priceLimits.max - (range * 0.1) ? 5 : 3 }}
                                            />

                                            {/* Max Range Input */}
                                            <input
                                                type="range"
                                                min={priceLimits.min}
                                                max={priceLimits.max}
                                                value={priceRange.high}
                                                onChange={(e) =>
                                                    handlePriceChange("high", e.target.value)
                                                }
                                                className="absolute w-full top-0 h-8 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                                                style={{ zIndex: 4 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= PRODUCTS / NODATA ================= */}
                    <div className="order-1 md:order-2">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Products
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {products?.length} Products Found
                                </p>
                            </div>
                        </div>

                        {isInitialLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader />
                            </div>
                        ) : products.length === 0 ? (
                            <NoData
                                Heading={"No Product Found !!"}
                                content={"Try changing filters or search."}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortedProducts?.map((item) => (
                                        <div
                                            key={item._id || item.id}
                                            className="relative"
                                        >
                                            <ProductCard item={item} />
                                        </div>
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={loading}
                                            className="px-12 py-3.5 border-2 border-gray-900 text-xs font-bold uppercase tracking-[0.15em] text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-40"
                                        >
                                            {loading ? "LOADING..." : "LOAD MORE"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductGrid;