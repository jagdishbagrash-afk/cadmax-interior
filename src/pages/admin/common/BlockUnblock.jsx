import React, { useState } from "react";
import { MdClose, MdBlock, MdLockOpen } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import Popup from "@/pages/common/Popup";

export default function BlockUnblock({ Id, status, fetchData, step }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const handleSuperCategory = () => {
    const main = new Listing();
    return main.Supercategorydelete(Id);
  };

  const handleCategory = () => {
    const main = new Listing();
    return main.categorydelete(Id);
  };

  const handleSubcategory = () => {
    const main = new Listing();
    return main.Subcategorydelete(Id);
  };

  const handleProduct = () => {
    const main = new Listing();
    return main.deleteProduct(Id);
  };

  const handleProject = () => {
    const main = new Listing();
    return main.deleteProject(Id);
  };

  const handleBanner = () => {
    const main = new Listing();
    return main.deleteBanner(Id);
  };

  const handleUser = () => {
    const main = new Listing();
    return main.deleteUser(Id);
  };


  const handleVendor = () => {
    const main = new Listing();
    return main.vendordelete(Id);
  };

  const handleServices = () => {
    const main = new Listing();
    return main.Servicesdelete(Id);
  };
  /* -------------------- MAIN HANDLER -------------------- */

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      // Step Based API Calling
      if (step === 1) response = await handleSuperCategory();
      else if (step === 2) response = await handleCategory();
      else if (step === 3) response = await handleSubcategory();
      else if (step === 4) response = await handleProduct();
      else if (step === 5) response = await handleProject();
      else if (step === 6) response = await handleUser();
      else if (step === 7) response = await handleBanner();
      else if (step === 8) response = await handleVendor();
      else if (step === 9) response = await handleServicesType();
      else if (step === 10) response = await handleServices();


      else throw new Error("Invalid Step");

      // Success Handling
      if (response && response?.data?.status) {
        toast.success(response.data.message || "Status Updated Successfully");
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
      fetchData(); // Refresh list
      toggleModal(); // Close popup
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex flex-col">
      {/* Block / Unblock Button */}
      <button
        onClick={toggleModal}
        className="cursor-pointer m-auto flex items-center justify-center
                    w-[42px] h-[42px] rounded-lg 
                    border border-gray-200 shadow-sm 
                    bg-white hover:bg-gray-50 transition-all duration-200"
      >
        {status === true ? (
          <FaUndo
            size={22}
            className="text-green-600 hover:text-green-700 transition"
          />
        ) : (
          <MdDelete
            size={22}
            className="text-red-600 hover:text-red-700 transition"
          />
        )}
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <Popup isOpen={isOpen} onClose={handleClose} size="max-w-lg">
          {/* Header */}
          <div className="border-b border-black/10 px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl text-[#212121] font-semibold">
              {status === true ? "Block" : "Unblock"}
            </h2>

            <button
              onClick={handleClose}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 px-4">
            <p className="text-[16px] font-medium text-[#3E3E3E] Creato">
              Are you sure you want to {status === true ? "restore" : "delete"}{" "}
              it?
            </p>
            <p className="text-red-600 text-[16px] font-medium Creato">
              (This action can be changed later.)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={toggleModal}
              className="text-black px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleClick}
              disabled={loading}
              className={`cursor-pointer font-[700] text-[14px] px-[20px] py-[10px] rounded-[5px]
                            ${loading
                  ? "bg-gray-400"
                  : "bg-black hover:bg-white"
                }
                            text-white hover:text-black cursor-pointer`}
            >
              {loading
                ? "Processing..."
                : status === true
                  ? "Restore"
                  : "Delete"}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}
