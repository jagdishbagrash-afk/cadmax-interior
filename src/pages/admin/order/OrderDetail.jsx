import React, { useState } from "react";
import Popup from "@/pages/common/Popup";
import { MdInfoOutline } from "react-icons/md";
import { MdClose } from "react-icons/md";

export default function OrderDetail({ data }) {
  if (!data) return null;
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = () => setShowPopup(false);
  return (
    <>
      <div className="flex justify-center items-center">
        <button
          title="View Order Details"
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowPopup(true)}
        >
          <MdInfoOutline size={22} />
        </button>
      </div>
      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={handleClose}
          size="max-w-[900px]"
        >
          {/* Header */}
          <div className="border-b border-black/10 px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl text-[#212121] font-semibold">
              Order Details
            </h2>

            <button
              onClick={handleClose}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            <div className="space-y-4">
              {data?.map((item, index) => {
  const selectedVariant = item?.id?.variants?.find(
    (v) =>
      v.title?.toLowerCase().trim() ===
        item.variant?.toLowerCase().trim() ||
      v.color?.toLowerCase().trim() ===
        item.variant?.toLowerCase().trim()
  );


                const image = selectedVariant?.images?.[0];

                return (
                  <div
                    key={index}
                    className="flex gap-4 items-center border rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={image}
                        alt={item?.id?.title}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-gray-800 capitalize">
                        {item?.id?.title}
                      </h3>

                        <span className="text-[16px] font-semibold text-gray-800 capitalize">
                    type:    {item?.priceSectionTitle}
                      </span>

                      <div className="text-[14px] text-gray-600 mt-1">
                        Color:{" "}
                        <span className="capitalize font-medium">
                          {item?.variant}
                        </span>
                      </div>

                      <div className="text-[14px] text-gray-600 mt-1">
                        Quantity:{" "}
                        <span className="font-medium">
                          {item?.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="text-right">
                      <div className="text-[14px] text-gray-500">
                        Price
                      </div>
                      <div className="text-[15px] font-semibold text-gray-800">
                        ₹{item?.price}
                      </div>

                      <div className="text-[14px] text-gray-500 mt-2">
                        Total
                      </div>
                      <div className="text-[16px] font-bold text-gray-900">
                        ₹{item?.total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
