import Listing from "@/pages/api/Listing";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Index() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const fetch = (id) => {
        setLoading(true);
        const main = new Listing();
        main.Success(id)
            .then((r) => {
                setLoading(false);
            })
            .catch((err) => {
                console.log("error", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (id) {
            fetch(id);
        }
    }, [id]);

    const [email, setEmail] = useState("");

    useEffect(() => {
        const item = localStorage && localStorage.getItem("email") || "";
        setEmail(item);
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <FaCheckCircle className="w-20 h-20 text-green-600 mb-6" />
            <h2 className="text-3xl font-bold text-black mb-2">
                Thank you for Booking!
            </h2>
            <p className="text-gray-600 text-center max-w-sm mb-1">
                Your booking has been confirmed.
            </p>
            <p className="text-gray-600 text-center max-w-sm mb-6">
                A confirmation email has been sent to <span className="font-medium">{email || ""}</span>
            </p>
            <Link href="/" className="bg-black text-white px-6 py-2 rounded-full hover:bg-red-700 ">
                Go to Homepage
            </Link>
        </div>
    );
}