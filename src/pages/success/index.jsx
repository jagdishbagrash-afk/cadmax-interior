import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";

export default function Index() {
  const router = useRouter();
//   const { id } = router.query; // payment id ya order id

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      
      {/* Icon */}
      <FaCheckCircle className="w-20 h-20 text-green-600 mb-6 animate-bounce" />

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
        Order Placed Successfully 🎉
      </h2>

      {/* Message */}
      <p className="text-gray-600 max-w-md mb-2">
        Thank you for your purchase! Your order has been successfully placed and is now being processed.
      </p>

      <p className="text-gray-600 max-w-md mb-4">
        We’ll notify you once your order is shipped.
      </p>

      {/* Order / Payment ID */}
      {/* {id && (
        <p className="text-sm text-gray-500 mb-6">
          Reference ID: <span className="font-semibold text-black">{id}</span>
        </p>
      )} */}

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Go to Home
        </Link>

        <Link
          href="/orders"
          className="border border-black text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}