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

                <div className="max-w-[1430px] container mx-auto px-4 md:px-8 py-12">

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
                        REFUND & RETURN POLICY
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Last Updated: [Date]
                    </p>

                    <div className="space-y-6 text-[15px] leading-8">

                        <div>
                            <p className="mb-4">
                                Welcome to Cadmaxatelier.
                            </p>

                            <p className="mb-4">
                                At Cadmaxatelier, we are committed to providing premium home décor
                                products, interior solutions, furniture, and lifestyle accessories.
                                Customer satisfaction is our priority, and we strive to ensure a
                                smooth shopping experience.
                            </p>

                            <p>
                                Please read our Refund & Return Policy carefully before making a
                                purchase.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                1. RETURN ELIGIBILITY
                            </h2>

                            <p className="mb-4">
                                Customers may request a return, replacement, or refund under the
                                following conditions:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Product received is damaged</li>
                                <li>Wrong product delivered</li>
                                <li>Product has manufacturing defects</li>
                                <li>Item received is incomplete or missing parts</li>
                            </ul>

                            <p className="mt-4 mb-4">
                                To qualify for a return:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Return request must be submitted within 7 days from the date of
                                    delivery
                                </li>
                                <li>
                                    Product must be unused, uninstalled, and in original condition
                                </li>
                                <li>
                                    Original packaging, invoice, tags, and accessories must be
                                    retained
                                </li>
                            </ul>

                            <p className="mt-4">
                                Cadmaxatelier reserves the right to reject return requests that do
                                not meet the above conditions.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                2. NON-RETURNABLE & NON-REFUNDABLE ITEMS
                            </h2>

                            <p className="mb-4">
                                The following items are not eligible for return or refund:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Customized or made-to-order furniture</li>
                                <li>Personalized décor items</li>
                                <li>Interior design consultation services</li>
                                <li>Installed products or assembled furniture</li>
                                <li>Digital products or downloadable content</li>
                                <li>Clearance sale or discounted products</li>
                                <li>
                                    Products damaged due to misuse, mishandling, or improper
                                    maintenance
                                </li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                3. DAMAGED, DEFECTIVE, OR WRONG PRODUCTS
                            </h2>

                            <p className="mb-4">
                                If you receive a damaged, defective, or incorrect product, you
                                must notify us within 7 days of delivery.
                            </p>

                            <p className="mb-4">
                                Customers are required to provide:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Order ID</li>
                                <li>Product images</li>
                                <li>Images/videos of damage</li>
                                <li>Packaging photos</li>
                                <li>Unboxing video (if available)</li>
                            </ul>

                            <p className="mt-4 mb-4">
                                After verification, Cadmaxatelier may provide:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Replacement</li>
                                <li>Repair support</li>
                                <li>Store credit</li>
                                <li>Full or partial refund</li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                4. RETURN PROCESS
                            </h2>

                            <p className="mb-4">
                                To initiate a return request:
                            </p>

                            <p className="mb-4">
                                Email us at:
                                <a
                                    href="mailto:support@cadmaxatelier.com"
                                    className="text-blue-600 ml-2 underline"
                                >
                                    support@cadmaxatelier.com
                                </a>
                            </p>

                            <p className="mb-4">
                                Please include:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Full Name</li>
                                <li>Order Number</li>
                                <li>Product Details</li>
                                <li>Reason for Return</li>
                                <li>Supporting photos/videos</li>
                            </ul>

                            <p className="mt-4">
                                Our support team will review your request within 2–5 business
                                days.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                5. REFUND POLICY
                            </h2>

                            <p className="mb-4">
                                Once the returned product is received and inspected, refunds will
                                be processed accordingly.
                            </p>

                            <p className="mb-4">
                                Important refund terms:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Refunds are processed within 7–10 business days</li>
                                <li>
                                    Refund amount will be credited to the original payment method
                                </li>
                                <li>
                                    COD order refunds may require bank account details
                                </li>
                                <li>
                                    Shipping and handling charges are non-refundable unless the
                                    error occurred from our side
                                </li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                6. ORDER CANCELLATION POLICY
                            </h2>

                            <h3 className="text-xl font-medium mb-3">
                                Customer Cancellation
                            </h3>

                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Orders can be cancelled before dispatch</li>
                                <li>Once shipped, orders cannot be cancelled</li>
                                <li>
                                    Customized or made-to-order products cannot be cancelled once
                                    production begins
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium mb-3">
                                Cancellation by Cadmaxatelier
                            </h3>

                            <p className="mb-4">
                                Cadmaxatelier reserves the right to cancel orders due to:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Product unavailability</li>
                                <li>Pricing or technical errors</li>
                                <li>Suspicious or fraudulent transactions</li>
                                <li>Delivery restrictions or logistics issues</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                7. EXCHANGE POLICY
                            </h2>

                            <p className="mb-4">
                                Exchanges are only applicable in cases of:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Damaged products</li>
                                <li>Defective products</li>
                                <li>Incorrect item delivery</li>
                            </ul>

                            <p className="mt-4">
                                Exchange requests are subject to stock availability.
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                8. SHIPPING & RETURN CHARGES
                            </h2>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Return shipping charges may apply for non-defective returns
                                </li>
                                <li>
                                    Free return pickup is available only for approved damaged or
                                    incorrect product cases
                                </li>
                                <li>
                                    Heavy furniture or oversized items may attract additional
                                    logistics charges
                                </li>
                            </ul>
                        </div>

                        {/* Section 10 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                9. FAILED DELIVERY / UNDELIVERED ORDERS
                            </h2>

                            <p className="mb-4">
                                If an order is returned back to us due to:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Incorrect address</li>
                                <li>Customer unavailable</li>
                                <li>Refusal to accept delivery</li>
                            </ul>

                            <p className="mt-4">
                                Additional shipping charges may apply for re-dispatch.
                            </p>
                        </div>

                        {/* Section 11 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                10. WARRANTY DISCLAIMER
                            </h2>

                            <p className="mb-4">
                                Unless explicitly mentioned, products sold on Cadmaxatelier do not
                                carry a manufacturer warranty.
                            </p>

                            <p className="mb-4">
                                Minor variations in:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Color</li>
                                <li>Texture</li>
                                <li>Fabric</li>
                                <li>Wood finish</li>
                                <li>Handcrafted patterns</li>
                            </ul>

                            <p className="mt-4">
                                shall not be considered defects.
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                11. LIMITATION OF LIABILITY
                            </h2>

                            <p className="mb-4">
                                Cadmaxatelier shall not be liable for:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Indirect or incidental damages</li>
                                <li>Delay caused by logistics partners</li>
                                <li>Installation delays</li>
                                <li>Third-party courier issues</li>
                                <li>
                                    Loss caused due to incorrect customer information
                                </li>
                            </ul>
                        </div>

                        {/* Section 14 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                12. POLICY CHANGES
                            </h2>

                            <p>
                                Cadmaxatelier reserves the right to modify, update, or change this
                                Refund & Return Policy at any time without prior notice.
                            </p>
                        </div>

                        {/* Section 15 */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                13. CONTACT INFORMATION
                            </h2>

                            <div className="bg-gray-100 rounded-2xl p-6">
                                <p className="mb-2 font-medium">
                                    Cadmaxatelier Support Team
                                </p>

                                <p className="mb-2">
                                    Email:
                                    <a
                                        href="mailto:support@cadmaxatelier.com"
                                        className="text-blue-600 ml-2 underline"
                                    >
                                        support@cadmaxatelier.com
                                    </a>
                                </p>

                                <p>
                                    Website:
                                    <a
                                        href="https://cadmaxatelier.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 ml-2 underline"
                                    >
                                        https://cadmaxatelier.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <p>
                                By purchasing from Cadmaxatelier, you acknowledge that you have
                                read, understood, and agreed to this Refund & Return Policy.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}