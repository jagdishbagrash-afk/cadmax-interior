import Listing from "@/pages/api/Listing";
import ProductCard from "@/pages/common/ProductCard";
import { useEffect, useState } from "react";

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
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.GetAllProdcuctColor();

      if (response?.data?.data) {

        const min = response.data.data.lowestPrice ?? 0;
        const max = response.data.data.highestPrice ?? 0;

        setColor(response.data.data.colors || []);

        setPriceLimits({
          min,
          max
        });

        setPriceRange({
          low: min,
          high: max
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

  const fetchProjectData = async (pageNo = 1, reset = false) => {
    try {
      if (loading) return;
      setLoading(true);
      const filters = {
        ...(selectedColors.length > 0 && {
          color: selectedColors.join(","),
        }),
        lowPrice: priceLimits.low,
        highPrice: priceLimits.high,
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


  useEffect(() => {
    if (!selectedId) return;

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProjectData(1, true);

  }, [selectedId, selectedColors, priceRange]);


  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjectData(nextPage);
  };

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

  const handlePriceChange = (type, value) => {
    value = Number(value);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    setPriceRange((prev) => {
      if (type === "low") {
        return {
          ...prev,
          low: Math.min(value, prev.high - 100),
        };
      }
      if (type === "high") {
        return {
          ...prev,
          high: Math.max(value, prev.low + 100),
        };
      }
      return prev;
    });
  };
  const handleClearFilters = () => {

    setSelectedColors([]);

    setPriceRange({
      low: priceLimits.min,
      high: priceLimits.max
    });

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProjectData(1, true);
  };
  console.log("color", color)
  const range = priceLimits.max - priceLimits.min || 1;

  const leftPercent = ((priceRange.low - priceLimits.min) / range) * 100;
  const widthPercent = ((priceRange.high - priceRange.low) / range) * 100;
  return (
    <div className="w-full px-6 md:px-10 lg:px-14 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* FILTER PANEL */}
        <div className="bg-white p-6 sticky top-24 h-max space-y-6  rounded-xl shadow-sm">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Filters
            </h3>

            <button
              onClick={handleClearFilters}
              className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-black hover:text-gray-500 transition"
            >
              Clear Filters
            </button>
          </div>

          {/* ================= COLOR FILTER ================= */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Color</h4>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              {color && color.map((c, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer group">

                  <input
                    type="checkbox"
                    checked={selectedColors.includes(c)}
                    onChange={() => handleColorChange(c)}
                    className="accent-black cursor-pointer"
                  />

                  <span
                    className="w-4 h-4 rounded-full border shadow-sm"
                    style={{ backgroundColor: c }}
                  />

                  <span className="capitalize text-gray-600 group-hover:text-black transition">
                    {c}
                  </span>

                </label>
              ))}
            </div>
          </div>

          {/* ================= PRICE FILTER ================= */}
          <div className="space-y-5 border-t pt-5">
            <h4 className="text-sm font-semibold text-gray-700">Price Range</h4>

            <div className="relative w-full h-6">
              {/* LOW RANGE */}
              <input
                type="range"
                min={priceLimits.min}
                max={priceLimits.max}
                value={priceRange.low}
                onChange={(e) => handlePriceChange("low", e.target.value)}
                className="absolute w-full pointer-events-none appearance-none bg-transparent
        [&::-webkit-slider-thumb]:pointer-events-auto
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-black"
              />

              {/* HIGH RANGE */}
              <input
                type="range"
                min={priceLimits.min}
                max={priceLimits.max}
                value={priceRange.high}
                onChange={(e) => handlePriceChange("high", e.target.value)}
                className="absolute w-full pointer-events-none appearance-none bg-transparent
        [&::-webkit-slider-thumb]:pointer-events-auto
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-black"
              />

              {/* TRACK */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>

              {/* ACTIVE RANGE */}
              <div
                className="absolute top-1/2 h-1 bg-black -translate-y-1/2 rounded-full"
                style={{
                  left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                  width: `${Math.max(0, Math.min(100, widthPercent))}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>₹{(priceRange.low ?? 0).toLocaleString()}</span>
              <span>₹{(priceRange.high ?? 0).toLocaleString()}</span>
            </div>
          </div>

        </div>


        {/* PRODUCT GRID */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products && products?.map((item) => (
              <ProductCard key={item._id || item.id} item={item} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-10 py-3 border text-sm font-bold hover:bg-black hover:text-white transition disabled:opacity-50"
              >
                {loading ? "LOADING..." : "LOAD MORE"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductGrid;
