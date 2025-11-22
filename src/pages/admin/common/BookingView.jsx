import Popup from "@/pages/common/Popup";
import React, { useState } from "react";
import {
  FaVideo,
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaMoneyBill,
  FaCalendarAlt,
  FaVideoSlash,
  FaEye,
} from "react-icons/fa";
import moment from "moment";
import { formatMultiPrice } from "@/components/ValueDataHook";
import { MdDownload } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import Listing from "@/pages/api/Listing";

const BookingView = ({ data, status }) => {
  if (!data) return null;
  const [downloading, setDownloading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const InfoCard = ({ icon, title, children }) => (
    <div className="bg-white p-5 rounded-2xl    border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-700 space-y-1 text-sm">{children}</div>
    </div>
  );
  const chatMessages = JSON.parse(data?.zoom?.chat || "[]");

  const handleDownload = async (url, index) => {
    if (downloading) return;
    setDownloading(true);

    const main = new Listing();

    try {
      const response = await main.TeacherZoomRecordingDownload(url, index);

      const blob = new Blob([response.data], { type: "video/mp4" });
      const linkElement = document.createElement("a");
      linkElement.href = URL.createObjectURL(blob);
      linkElement.download = `Recording-${index + 1}.mp4`;
      document.body.appendChild(linkElement);
      linkElement.click();
      linkElement.remove();

      setDownloading(false);
    } catch (error) {
      console.error("Error downloading recording:", error);
      setDownloading(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 capitalize text-black text-sm lg:text-base font-medium font-inter whitespace-nowrap cursor-pointer"
        onClick={() => setShowPopup(true)}
        role="button"
        tabIndex={0}
      >
        <span className="flex gap-1  items-center">
          <IoMdEye size={24} />
        </span>
      </div>

      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          size="max-w-[1000px]"
        >
          <div className="space-y-6">
            {/* Gradient Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Booking Details{" "}
              </h2>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoCard icon={<FaUser className="text-red-500" />} title="User">
                <div className="flex items-center gap-4">
                  <img
                    src={data.UserId?.profile_photo || "/Placeholder.png"}
                    alt={data.UserId?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow"
                  />
                  <div className="space-y-1 text-left">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {data?.UserId?.name}
                    </p>
                    <p>
                      <span className="font-semibold break-all">Email:</span>
                      <span className="break-all"> {data?.UserId?.email}</span>
                    </p>

                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {data?.UserId?.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Time Zone:</span>{" "}
                      {data?.UserId?.time_zone}
                    </p>
                  </div>
                </div>
              </InfoCard>

              <InfoCard
                icon={<FaChalkboardTeacher className="text-red-500" />}
                title="Teacher"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={data.teacherId?.profile_photo || "/Placeholder.png"}
                    alt={data.teacherId?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow"
                  />
                  <div className="space-y-1 text-left">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {data?.teacherId?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>
                      <span className="break-all">
                        {" "}
                        {data?.teacherId?.email}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {data?.teacherId?.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Time Zone:</span>{" "}
                      {data?.teacherId?.time_zone}
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>

            <InfoCard icon={<FaBook className="text-red-400" />} title="Lesson">
              <div className="space-y-2 text-left">
                {/* Title with icon */}
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-gray-800 capitalize">
                    Name: {data.LessonId?.title}
                  </h2>
                </div>

                {/* Duration & Price Pills */}
                <div className="flex gap-3 mt-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Duration: {data.LessonId?.duration} min
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Price: {formatMultiPrice(data.LessonId?.price, "USD")}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {data.LessonId?.description || "No description provided."}
                </p>
              </div>
            </InfoCard>

            <InfoCard
              icon={<FaMoneyBill className="text-red-400" />}
              title="Payment"
            >
              <div className="space-y-2 text-left">
                {/* Total Amount */}
                {status != "teacher" && (
                  <div>
                    <span className="font-semibold">Total Amount Paid:</span>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {formatMultiPrice(data.totalAmount, "USD")}
                    </span>
                  </div>
                )}

                {/* Teacher / Admin / Processing */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Teacher:
                    {formatMultiPrice(data.teacherEarning, "USD")}
                  </span>
                  {status != "teacher" && (
                    <>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Admin:
                        {formatMultiPrice(data.adminCommission, "USD")}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Fee:
                        {formatMultiPrice(data.processingFee, "USD")}
                      </span>
                    </>
                  )}
                </div>

                {/* Bonus */}
                {data.BonusId?.amount ? (
                  <div className="mt-2">
                    <span className="font-semibold">Bonus Earned:</span>
                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                      {formatMultiPrice(data.BonusId.amount, "USD")}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-500">
                    No bonus earned.
                  </div>
                )}

                {/* Payment Platform */}
                <div className="mt-2 text-sm">
                  <span className="font-semibold">Payment Method:</span>
                  {data.StripepaymentId || data.payment_id ? (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                      Stripe
                    </span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      PayPal
                    </span>
                  )}
                </div>
              </div>
            </InfoCard>

            <InfoCard
              icon={<FaCalendarAlt className="text-red-400" />}
              title="Booking"
            >
              <div className="space-y-2 text-left">
                <div className="space-y-1 text-left">
                  <p>
                    <span className="font-semibold">Lesson:</span>
                    <span className="ml-2 text-gray-800 capitalize">
                      {data.LessonId?.title}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Start:</span>
                    <span className="ml-2 px-2 py-0.5   rounded-full text-xs font-medium">
                      {moment(data.startDateTime).format(
                        "MMMM D, YYYY  h:mm A"
                      )}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">End:</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium">
                      {moment(data.endDateTime).format("MMMM D, YYYY  h:mm A")}
                    </span>
                  </p>
                </div>

                {/* Created At */}
                <p className="text-xs text-gray-500">
                  Booking Created:
                  {moment(data.createdAt).format("MMMM D, YYYY  h:mm A")}
                </p>

                {/* Status pills */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.lessonCompletedStudent && data.lessonCompletedTeacher
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data.lessonCompletedStudent && data.lessonCompletedTeacher
                      ? "Completed"
                      : "In Progress"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.rescheduled
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {data.rescheduled ? "Rescheduled" : "No Rescheduled"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.payoutDoneAt
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {data.payoutDoneAt
                      ? `Payout Done at ${moment(data.payoutDoneAt).format(
                          "MMMM D, YYYY  h:mm A"
                        )}`
                      : data.payoutCreationDate
                      ? ` Payout  Requested at ${moment(
                          data.payoutCreationDate
                        ).format("MMMM D, YYYY  h:mm A")}`
                      : "Payout Pending"}
                  </span>
                </div>
              </div>
            </InfoCard>

            {data.zoom ? (
              <InfoCard
                icon={<FaVideoSlash className="text-red-600" />}
                title="Zoom Meeting"
              >
                <div className="text-left">
                  <span className="font-semibold text-gray-700 block mb-1">
                    Meeting ID: {data.zoom.meetingId}
                  </span>
                </div>

                {data.zoom.download?.length > 0 && (
                  <div className="mt-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-2">
                      {data.zoom.download.map((link, index) => (
                        <div key={index} className="flex flex-col items-start">
                          <div className="flex justify-between items-center w-full mb-1">
                            <p className="font-medium text-md text-gray-800">
                              Recording {index + 1}
                            </p>
                            <p>
                              <button
                                onClick={() => handleDownload(link, index)}
                                className="text-green-600 text-md flex gap-1 items-center cursor-pointer"
                              >               
                                <MdDownload />
                                Download
                              </button>
                            </p>
                          </div>

                          {/* <video
                            controls
                            src={link}
                            className="w-full max-h-48 rounded-md border border-gray-300"
                          >
                            Your browser does not support the video tag.
                          </video> */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="mt-6">
                  <div className="border rounded-lg p-4  space-y-3">
                    {chatMessages?.length === 0 ? (
                      <p className="text-black text-sm">No chat available.</p>
                    ) : (
                      chatMessages?.map((chat, index) => {
                        const isTeacher = chat.name
                          ?.toLowerCase()
                          .includes("teacher");
                        return (
                          <div
                            key={index}
                            className={`flex flex-col ${
                              isTeacher ? "items-start" : "items-end"
                            } mb-4`}
                          >
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isTeacher
                                  ? "bg-[#000000] text-white "
                                  : "bg-[#000000] text-white"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-line">
                                {chat.message.replaceAll("\\r", "")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-black ">
                              <div className="font-semibold">
                                {chat.name?.replace(":", "")}
                              </div>
                              <span
                                className={`${
                                  isTeacher ? "text-balck" : "text-black"
                                }`}
                              >
                                {chat.time}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </InfoCard>
            ) : (
              <p className="text-gray-500">
                No Zoom link was generated for this meeting
              </p>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default BookingView;
