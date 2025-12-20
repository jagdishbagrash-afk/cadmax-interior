import ProductCard from "@/pages/common/ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <div className="w-full px-6 md:px-10 lg:px-14 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* FILTER PANEL */}
        <div className="bg-white  p-5 sticky top-24 h-max space-y-5">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
              Filters
            </h3>
            <button className="text-xs text-gray-500 hover:text-black transition">
              Hide
            </button>
          </div>

          {/* AVAILABILITY */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Availability
            </h4>

            <label className="flex items-center gap-2 text-sm cursor-pointer group">
              <input type="checkbox" className="accent-black" />
              <span className="group-hover:text-black transition">In Stock</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer group">
              <input type="checkbox" className="accent-black" />
              <span className="group-hover:text-black transition">Made To Order</span>
            </label>
          </div>

          {/* COLOR */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Color</h4>

            <div className="grid grid-cols-2 gap-2 text-sm">

              {[
                { name: "Black Antique", color: "bg-black" },
                { name: "Dark Blue", color: "bg-slate-700" },
                { name: "Dark Green", color: "bg-green-700" },
                { name: "Distressed Grey", color: "bg-stone-400" },
                { name: "Natural Acacia", color: "bg-neutral-300" },
              ].map((c, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer group hover:text-black transition"
                >
                  <span className={`w-4 h-4 rounded-full border ${c.color}`}></span>
                  {c.name}
                </label>
              ))}

            </div>
          </div>

          {/* PRICE */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Price</h4>

            <input
              type="range"
              min="1000"
              max="100000"
              className="w-full accent-black"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>₹1,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* CLEAR BUTTON */}
          <button className="w-full border mt-2 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition">
            Clear filters
          </button>

        </div>



        {/* PRODUCT GRID */}
        <div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((item) => (
              <ProductCard key={item._id || item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button className="px-10 py-3 border text-sm font-bold hover:bg-black hover:text-white transition cursor-pointer">
              LOAD MORE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductGrid;
