import React from "react";
import ProductList1 from "../../Assets/Images/ProductList1.png";
import ProductList2 from "../../Assets/Images/ProductList2.png";
import ProductList3 from "../../Assets/Images/ProductList3.png";
import ProductList4 from "../../Assets/Images/ProductList4.png";

const products = [
  {
    id: 1,
    title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
    price: "₹68,500",
    image: ProductList1?.src,
  },
  {
    id: 2,
    title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
    price: "₹22,300",
    image: ProductList2?.src,
  },
  {
    id: 3,
    title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
    price: "₹35,750",
    image: ProductList3.src,
  },
  {
    id: 4,
    title: "AURELUM LARGE FORM SCULPTED CERAMIC CENTERPIECE VASE",
    price: "₹85,000",
    image: ProductList4.src,
  },
  {
    id: 5,
    title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
    price: "₹68,500",
    image: ProductList1?.src,
  },
  {
    id: 6,
    title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
    price: "₹22,300",
    image: ProductList2?.src,
  },
  {
    id: 7,
    title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
    price: "₹35,750",
    image: ProductList3.src,
  },
  {
    id: 8,
    title: "AURELUM LARGE FORM SCULPTED CERAMIC CENTERPIECE VASE",
    price: "₹85,000",
    image: ProductList4.src,
  },
  {
    id: 9,
    title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
    price: "₹68,500",
    image: ProductList1?.src,
  },
  {
    id: 10,
    title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
    price: "₹22,300",
    image: ProductList2?.src,
  },
  {
    id: 11,
    title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
    price: "₹35,750",
    image: ProductList3.src,
  },
  {
    id: 12,
    title: "AURELUM LARGE FORM SCULPTED CERAMIC CENTERPIECE VASE",
    price: "₹85,000",
    image: ProductList4.src,
  },
];

const ProductGrid = () => {
  return (
    <div className="w-full px-6 md:px-10 lg:px-16 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.86875 4.8125C8.59375 3.64375 7.49375 2.75 6.1875 2.75C4.88125 2.75 3.85 3.64375 3.50625 4.8125H1.375V6.1875H3.50625C3.78125 7.35625 4.88125 8.25 6.1875 8.25C7.49375 8.25 8.525 7.35625 8.86875 6.1875H20.625V4.8125H8.86875ZM6.1875 6.875C5.43125 6.875 4.8125 6.25625 4.8125 5.5C4.8125 4.74375 5.43125 4.125 6.1875 4.125C6.94375 4.125 7.5625 4.74375 7.5625 5.5C7.5625 6.25625 6.94375 6.875 6.1875 6.875ZM15.8125 8.25C14.5063 8.25 13.475 9.14375 13.1313 10.3125H1.375V11.6875H13.1313C13.4062 12.8562 14.5063 13.75 15.8125 13.75C17.1187 13.75 18.15 12.8562 18.4937 11.6875H20.625V10.3125H18.4937C18.2188 9.14375 17.1187 8.25 15.8125 8.25ZM15.8125 12.375C15.0562 12.375 14.4375 11.7563 14.4375 11C14.4375 10.2438 15.0562 9.625 15.8125 9.625C16.5688 9.625 17.1875 10.2438 17.1875 11C17.1875 11.7563 16.5688 12.375 15.8125 12.375ZM9.625 13.75C8.31875 13.75 7.2875 14.6438 6.94375 15.8125H1.375V17.1875H6.94375C7.21875 18.3562 8.31875 19.25 9.625 19.25C10.9312 19.25 11.9625 18.3562 12.3062 17.1875H20.625V15.8125H12.3062C12.0312 14.6438 10.9312 13.75 9.625 13.75ZM9.625 17.875C8.86875 17.875 8.25 17.2563 8.25 16.5C8.25 15.7437 8.86875 15.125 9.625 15.125C10.3813 15.125 11 15.7437 11 16.5C11 17.2563 10.3813 17.875 9.625 17.875Z"
                fill="black"
              />
            </svg>
            <span className="text-base text-[#171717] font-bold tracking-wide uppercase Creato">
              Filter
            </span>
          </div>
          <span className="text-sm font-normal tracking-wide text-[#4D5466] Creato">
            23 Results
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal tracking-wide Creato">
          <span className="uppercase text-[#4D5466]">Sort By:</span>
          <select className="bg-transparent outline-none cursor-pointer text-[#171717]">
            <option value="best">Best Selling</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products &&
          products?.map((item) => (
            <div key={item?.id} className="group cursor-pointer">
              <div className="w-full h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden">
                <img
                  src={item?.image}
                  alt={item?.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product title */}
              <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase Creato">
                {item?.title}
              </h3>

              {/* Price */}
              <p className="mt-1 text-base text-[#171717] font-extrabold uppercase Creato">
                {item?.price}
              </p>
            </div>
          ))}
      </div>
      <div className="w-full flex justify-center mt-8">
      <button className="px-10 py-3 border border-[#171717] text-sm text-[#171717] font-bold tracking-wide hover:bg-black hover:text-white transition Creato cursor-pointer">
        LOAD MORE
      </button>
    </div>
    </div>
  );
};

export default ProductGrid;
