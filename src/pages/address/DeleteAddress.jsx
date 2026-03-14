import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";

function DeleteAddress({ uuid, setAddress }) {
  const [open, setOpen] = useState(false);
  const [processing, setProcesssing] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    const formData = new FormData();
    setProcesssing(true)
    formData.append("uuid", uuid);
    axios.post(route("address.destroy"), formData)
      .then((response) => {
        if (response?.data?.success) {
          setAddress(response?.data?.data)
          toast.success(response?.data?.message, {
            duration: 3000
          });
          handleClose();
        } else {
          toast.error(response?.data?.message);
        }
        setProcesssing(false)

      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error?.response?.data?.message);
        setProcesssing(false)

      });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-[#FF1B1B] bg-white hover:text-white hover:bg-[#FF1B1B] text-sm font-medium tracking-[-0.03em] h-8 lg:h-[41px] px-8 border border-[#FF1B1B] rounded-full outline-none focus:outline-none ease-linear transition-all duration-150"
      >
        Delete
      </button>

      <Modal show={open} className="shadow-none">
        <div className="relative bg-white w-full rounded-[30px] lg:rounded-[40px] h-auto m-auto">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 md:top-6 lg:top-9 right-6 lg:right-10 text-gray-700 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="border-b border-black border-opacity-10 pt-6 pb-5 px-6 lg:pt-8 lg:pb-6 lg:px-10">
            <h2 className="text-xl lg:text-2xl text-[#212121] tracking-[-0.04em] font-semibold mb-0">
              Delete Address
            </h2>
          </div>

          <div className="p-6 lg:p-10">
            <p className="text-sm lg:text-base text-[#212121] tracking-[-0.02em] mb-6">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="text-white bg-[#0367F7] hover:text-[#0367F7] hover:bg-white text-sm font-medium tracking-[-0.03em] h-8 lg:h-[41px] px-8 border border-[#0367F7] rounded-full outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={processing}
                className="text-[#FF1B1B] bg-white hover:text-white hover:bg-[#FF1B1B] text-sm font-medium tracking-[-0.03em] h-8 lg:h-[41px] px-8 border border-[#FF1B1B] rounded-full outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                {processing ? "Loading.." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteAddress;
