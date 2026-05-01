import Loader from "@/components/Loader";
import Listing from "@/pages/api/Listing";
import NoData from "@/pages/common/NoData";
import ProductCard from "@/pages/common/ProductCard";
import { useEffect, useRef, useState } from "react";

const ProductGrid = ({ selectedId }) => {
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

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

  const priceDebounceRef = useRef(null);

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
  const fetchProjectData = async (pageNo = 1, reset = false) => {
    try {
      if (loading) return;

      setLoading(true);

      const filters = {
        ...(selectedColors.length > 0 && {
          color: selectedColors.join(","),
        }),
        lowPrice: priceRange.low,
        highPrice: priceRange.high,
      };

      const main = new Listing();

      const response = await main.getAllProductSubCategroy(
        selectedId,
        pageNo,
        limit,
        filters
      );

      const resData = response?.data?.data;
      const newProducts = resData?.data || [];
      const pagination = resData?.pagination;

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(pagination?.page < pagination?.totalPages);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT LOAD =================
  useEffect(() => {
    if (!selectedId) return;

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProjectData(1, true);
  }, [selectedId, selectedColors]);

  // ================= LOAD MORE =================
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjectData(nextPage);
  };

  // ================= COLOR FILTER =================
  const handleColorChange = (color) => {
    setPage(1);
    setProducts([]);
    setHasMore(true);

    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  // ================= PRICE FILTER (DEBOUNCE FIX) =================
  const handlePriceChange = (type, value) => {
    value = Number(value);

    setPriceRange((prev) => {
      let low = prev.low;
      let high = prev.high;

      if (type === "low") low = value;
      if (type === "high") high = value;

      return { low, high };
    });

    setPage(1);
    setProducts([]);
    setHasMore(true);

    // debounce API call
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    priceDebounceRef.current = setTimeout(() => {
      fetchProjectData(1, true);
    }, 500);
  };

  // ================= CLEAR FILTER =================
  const handleClearFilters = () => {
    setSelectedColors([]);

    setPriceRange({
      low: priceLimits.min,
      high: priceLimits.max,
    });

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProjectData(1, true);
  };

  const range = priceLimits.max - priceLimits.min || 1;

  const leftPercent =
    ((priceRange.low - priceLimits.min) / range) * 100;

  const widthPercent =
    ((priceRange.high - priceRange.low) / range) * 100;

  const isInitialLoading = loading && products.length === 0;

  return (
    <>
      <div className="w-full px-6 md:px-10 lg:px-14 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">

          {/* ================= FILTER PANEL (ALWAYS SHOW) ================= */}
          <div className="bg-white p-2 md:p-6 sticky top-24 h-max space-y-6 rounded-xl shadow-md order-2 md:order-1">

            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                Filters
              </h3>

              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold uppercase text-black hover:text-gray-500"
              >
                Clear Filters
              </button>
            </div>

            {/* COLOR */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Color</h4>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {color.map((c, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(c)}
                      onChange={() => handleColorChange(c)}
                    />
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: c }}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="space-y-4 border-t pt-5 cursor-pointer">
              <h4 className="text-sm font-semibold text-gray-700">
                Price Range
              </h4>

              <div className="relative w-full h-6">
                <input
                  type="range"
                  min={priceLimits.min}
                  max={priceLimits.max}
                  value={priceRange.low}
                  onChange={(e) =>
                    handlePriceChange("low", e.target.value)
                  }
                  className="absolute w-full"
                />

                <input
                  type="range"
                  min={priceLimits.min}
                  max={priceLimits.max}
                  value={priceRange.high}
                  onChange={(e) =>
                    handlePriceChange("high", e.target.value)
                  }
                  className="absolute w-full"
                />

                {/* <div className="absolute top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" /> */}

                <div
                  className="absolute top-1/2 h-1 bg-black -translate-y-1/2 rounded-full"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span>₹{priceRange.low}</span>
                <span>₹{priceRange.high}</span>
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS / NODATA ================= */}
          <div className="order-1 md:order-2">

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {products.map((item) => (
                    <ProductCard
                      key={item._id || item.id}
                      item={item}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-10 py-3 border text-sm font-bold"
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