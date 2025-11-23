import React, { useEffect, useState } from 'react'
import AdminLayout from './common/AdminLayout'
import Listing from '../api/Listing';
import { MdReviews } from 'react-icons/md';
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { TbBrandBooking } from "react-icons/tb";
import { AiFillStar } from 'react-icons/ai';
import moment from 'moment';
import Link from 'next/link';
import { ReviewLoader, TableLoader } from '@/components/Loader';
import NoData from '../common/NoData';
import Image from 'next/image';
export default function Index() {
  const [listing, setListing] = useState(null); // Fix typo in setListing
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const main = new Listing();
    main
      .AdminDashboard()
      .then((r) => {
        setListing(r?.data?.data); // ✅ Update state with data
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout page={"Dashboard"}>
      <div className="min-h-screen p-5 lg:p-[30px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 ">
          <div className="relative bg-white rounded-xl dashboard-box p-3.5 lg:p-4 xl:p-5 border border-[rgba(204,40,40,0.2)] flex flex-col sm:min-h-[136px]">
            <h2 className="font-inter text-[#000000] font-bold text-lg lg:text-xl xl:text-xl capitalize tracking-[-0.04em]">
              active teachers
            </h2>
            <div className="absolute right-4 lg:right-5 xl:right-6 bg-[#CC28281A] border-[0.67px] border-[#CC282880] p-3 rounded">
              <Link href="/admin/teacher">
                <GiTeacher className="text-[#000000]" size={24} />
              </Link>
            </div>

            <div className="text-sm text-[#535353] space-y-1 mt-4">
              <p className="font-inter text-base lg:text-lg xl:text-xl font-bold tracking-[-0.04em]">
                {listing?.Countteacher} {/* Safely access ReviewesCount */}
              </p>
            </div>
          </div>
          <div className="relative bg-white rounded-xl dashboard-box p-3.5 lg:p-4 xl:p-5 border border-[rgba(204,40,40,0.2)] flex flex-col sm:min-h-[136px]">
            <h2 className="font-inter text-[#000000] font-bold text-lg lg:text-xl xl:text-xl capitalize tracking-[-0.04em]">
              Active Students
            </h2>
            <div className="absolute right-4 lg:right-5 xl:right-6 bg-[#CC28281A] border-[0.67px] border-[#CC282880] p-3 rounded">
              <Link href="/admin/student">
                <PiStudentBold className="text-[#000000]" size={24} />
              </Link>
            </div>
            <div className="text-sm text-[#535353] space-y-1 mt-4">
              <p className="font-inter text-base lg:text-lg xl:text-xl font-bold tracking-[-0.04em]">
                {listing?.countstudent} {/* Safely access ReviewesCount */}
              </p>
            </div>
          </div>
          <div className="relative bg-white rounded-xl dashboard-box p-3.5 lg:p-4 xl:p-5 border border-[rgba(204,40,40,0.2)] flex flex-col sm:min-h-[136px]">
            <h2 className="font-inter text-[#000000] font-bold text-lg lg:text-xl xl:text-xl capitalize tracking-[-0.04em]">
              Pending Reviews
            </h2>
            <div className="absolute right-4 lg:right-5 xl:right-6 bg-[#CC28281A] border-[0.67px] border-[#CC282880] p-3 rounded">
              <Link href="/admin/reviews">
                <MdReviews className="text-[#000000]" size={24} />
              </Link>
            </div>

            <div className="text-sm text-[#535353] space-y-1 mt-4">
              <p className="font-inter text-base lg:text-lg xl:text-xl font-bold tracking-[-0.04em]">
                {listing?.pendingreview} {/* Safely access ReviewesCount */}
              </p>
            </div>
          </div>
          <div className="relative bg-white rounded-xl dashboard-box p-3.5 lg:p-4 xl:p-5 border border-[rgba(204,40,40,0.2)] flex flex-col min-h-[136px]">
            <h2 className="font-inter text-[#000000] font-bold text-lg lg:text-xl xl:text-xl capitalize tracking-[-0.04em]">
              Total Completed <br></br> Booking
            </h2>
            <div className="absolute right-4 lg:right-5 xl:right-6 bg-[#CC28281A] border-[0.67px] border-[#CC282880] p-3 rounded">
              <Link href="/admin/booking">
                <TbBrandBooking className="text-[#000000]" size={24} />
              </Link>
            </div>
            <div className="text-sm text-[#535353] space-y-1 mt-4">
              <p className="font-inter text-base lg:text-lg xl:text-xl font-bold tracking-[-0.04em]">
                {listing?.totalbooking} {/* Safely access ReviewesCount */}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-[rgba(204,40,40,0.2)] overflow-auto mt-4 ">
          <div className='px-5 pt-5'>
            <h2 className="text-[#000000] text-xl lg:text-2xl font-semibold mb-4">Teacher Management</h2>
          </div>
          <table className="min-w-full text-sm text-center rounded-[20px]">
            <thead className="bg-[rgba(204,40,40,0.1)] text-[#535353] tracking-[-0.04em] font-inter rounded-[20px] whitespace-nowrap">
              <tr>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize ">
                  Teacher name
                </th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize ">
                  Email
                </th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                  Nationality
                </th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                  Gender
                </th>
                {/* <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                  View
                </th> */}
              </tr>
            </thead>
            {loading ? (
              <TableLoader length={4} />
            ) : (
              <tbody>
                {listing?.TeacherData?.map((item, index) => {
                  const user = item?.userId;
                  return (
                    <tr
                      key={index}
                      className={`border-t hover:bg-[rgba(204,40,40,0.1)] border-[rgba(204,40,40,0.2)] ${user?.block ? "opacity-50" : ""}`}
                    >
                      <td className="capitalize whitespace-nowrap px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter">
                        <Link href={`/admin/teacher/${user?._id}`} >
                          {user?.name || "—"}
                        </Link>
                      </td>
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter ">
                        {user?.email || "—"}
                      </td>
                      <td className="whitespace-nowrap capitalize px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter">
                        {/* {item?.qualifications?.replaceAll("_", " ") || "N/A"} */}
                        {user?.nationality || "N/A"}
                      </td>
                      <td className="capitalize whitespace-nowrap px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter">
                        {item?.gender || "N/A"}
                      </td>
                      {/* <td className="capitalize whitespace-nowrap px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter">
                        <Link href={`/admin/teacher/${user?._id}`} className='text-center'>
                          <IoMdEye size={22} />
                        </Link>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>)}
          </table>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow border border-[rgba(204,40,40,0.2)]  mt-3 ">
          <h2 className="text-[#000000] text-xl lg:text-2xl font-semibold mb-4">Reviews</h2>
          {
            loading ? (
              <ReviewLoader />
            ) : (
              listing?.ReviewData?.length > 0 ? (
                listing.ReviewData.map((review) => (
                  <div key={review._id} className="border border-gray-100 rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-3 items-center">
                        <Image
                          src={review?.userId?.profile_photo || "/Placeholder.png"}
                          height={100}
                          width={100}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border" />
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{review.userId?.name}</p>
                          <p className="text-xs text-gray-500">
                            {moment(review.createdAt).format("MMMM D, YYYY [at] hh:mm A") || ""}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                    ${review.review_status === 'Pending' ? 'bg-yellow-100 text-yellow-700'
                          : review.review_status === 'Reject' ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'}`}>
                        {review.review_status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      Lesson: <span className="font-medium text-gray-800">{review.lessonId?.title}</span>
                    </p>

                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <AiFillStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.description}
                    </p>
                  </div>
                ))
              ) : (
                <NoData Heading={"No reviews available"} />
              )
            )
          }
        </div>
      </div>
    </AdminLayout >
  );
}
