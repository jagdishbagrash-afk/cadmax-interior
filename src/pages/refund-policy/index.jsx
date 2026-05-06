import React from "react";
import Layout from "../common/Layout";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";
import Banner from "@/components/Banner";

export default function RefundPolicy() {
    return (
        <Layout>
            <Banner
                Slider1={ProductListBanner}
                title={"Refund Policy"}
            />
            <div className="policy-page pt-[20px] pb-[20px]">

                <div className='container mx-auto px-4 max-w-[1430px]'>
                    {/* Hero */}
                    <h2 className="font-semibold text-lg mb-2">
                        Refund Policy
                    </h2>
                    <p className="mb-3" >
                        Customer satisfaction is our top priority. Please read our refund policy carefully.
                    </p>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">1. Eligibility</h2>
                        <ul className="list-disc ml-5">
                            <li>Product is damaged or incorrect</li>
                            <li>Request raised within 7 days</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">2. Non-Refundable</h2>
                        <ul className="list-disc ml-5">
                            <li>Custom-made products</li>
                            <li>Returned after 7 days</li>
                            <li>Damaged by misuse</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">3. Process</h2>
                        <ul className="list-decimal ml-5">
                            <li>Email support@cadmaxatelier.com</li>
                            <li>Provide order details</li>
                            <li>Refund processed in 5-7 days</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">4. Refund Mode</h2>
                        <p>Refund will be issued to original payment method.</p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">5. Contact</h2>
                        <p>Email: support@cadmaxatelier.com</p>
                        <p>Phone: +91 98765 43210</p>
                    </div>


                    {/* Content */}

                </div>
            </div>
        </Layout>
    );
}