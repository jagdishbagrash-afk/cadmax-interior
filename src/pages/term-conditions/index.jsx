"use client";

import Banner from "@/components/Banner";
import React from "react";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";

export default function TermsConditions() {
    return (
        <>
            <Layout>
                <Banner Slider1={ProductListBanner}
                    title={" Terms & Conditions"}
                    content={" Last Updated: March 2026"}
                />
            <div className="policy-page pt-[20px] pb-[20px]">

                    <div className='mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4'>


                        {/* Section */}
                        <Section title="1. Introduction">
                            <p>
                                Welcome to <span className="font-bold">Cadmax Atelier</span> (“Company”, “we”, “our”, or “us”).
                            </p>
                            <p className="mt-3">
                                These Terms and Conditions govern your use of our website, services, and products.
                            </p>
                            <p className="mt-3">
                                By accessing our website or using our services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
                            </p>
                        </Section>

                        <Section title="2. Use of Our Website">

                            <p className="mt-3 mb-3">
                                By using this website, you agree that:
                            </p>

                            <ul className="list-disc pl-5 space-y-2">
                                <li>You will use the website only for lawful purposes.</li>
                                <li>You will not misuse or attempt to disrupt the website.</li>
                                <li>You will not copy, reproduce, or distribute content without permission.</li>
                            </ul>
                            <p className="mt-3">
                                We reserve the right to restrict or terminate access to users who violate these terms.

                            </p>
                        </Section>

                        <Section title="3. Services">
                            <p>
                                Cadmax Atelier provides interior design services, digital design solutions, and related products through this platform.
                            </p>
                            <p className="mt-3">
                                All services are subject to availability and confirmation by our team. We reserve the right to modify or discontinue any service without prior notice.
                            </p>
                        </Section>

                        <Section title="4. User Information">
                            <p className="mt-3 mb-3">
                                When you submit information on our website (such as contact details or project requirements), you agree that:
                            </p>

                            <ul className="list-disc pl-5 space-y-2">
                                <li>The information provided must be accurate and complete.</li>
                                <li>You are responsible for maintaining confidentiality of account details.</li>
                                <li>We handle your data as per our Privacy Policy.</li>
                            </ul>

                            <p className="mt-3 mb-3">
                                We handle your personal data in accordance with our Privacy Policy.
                            </p>

                        </Section>

                        <Section title="5. Pricing and Payments">
                            <p>
                                All pricing for services or products listed on our website is subject to change without prior notice.

                            </p>
                            <p className="mt-3">
                                Payments may be processed through secure third-party payment gateways. Cadmax Atelier is not responsible for issues arising from third-party payment services.
                            </p>
                        </Section>

                        <Section title="6. Intellectual Property">
                            <p className="mb-3">
                                All content on this website including:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Text</li>
                                <li>Images</li>
                                <li>Designs</li>
                                <li>Graphics</li>
                                <li>Logos</li>
                            </ul>
                            <p className="mt-3">
                                is the intellectual property of <span className="font-bold">Cadmax Atelier</span>  unless otherwise stated.

                            </p>
                            <p className="mt-3">
                                You may not reproduce, distribute, or use any material without written permission.
                            </p>
                        </Section>

                        <Section title="7. Third-Party Links">
                            <p>
                                Our website may contain links to third-party websites or services.
                            </p>
                            <p className="mt-3">
                                We are not responsible for the content, privacy practices, or policies of those external websites.
                            </p>
                        </Section>

                        <Section title="8. Limitation of Liability">
                            <p className="mb-3">
                                <span className="font-bold">Cadmax Atelier</span>  shall not be liable for any direct, indirect, incidental, or consequential damages resulting from:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Use or inability to use the website</li>
                                <li>Errors or inaccuracies in content</li>
                                <li>Third-party services or links</li>
                            </ul>
                            <p className="mt-3">
                                All services are provided on an “as-is” basis.

                            </p>
                        </Section>

                        <Section title="9. Changes to Terms">
                            <p>
                                We reserve the right to update or modify these Terms & Conditions at any time without prior notice.

                            </p>
                            <p className="mt-3">
                                Your continued use of the website after any changes indicates acceptance of the updated terms.
                            </p>
                        </Section>

                        <Section title="10. Governing Law">
                            <p>
                                These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.
                            </p>
                            <p className="mt-3">
                                Any disputes arising from the use of this website will be subject to the jurisdiction of the courts in India.                    </p>
                        </Section>

                        <Section title="11. Contact Us">
                            <p className="mt-2 mb-2">If you have any questions regarding these Terms & Conditions, please contact us:
                            </p>
                            <span className="font-bold">Cadmax Atelier</span>
                            <p>
                                Email:{" "}
                                <a
                                    href="mailto:support@cadmaxatelier.com"
                                    className="text-blue-600 hover:underline"
                                >
                                    support@cadmaxatelier.com
                                </a>
                            </p>
                            <p>
                                Website:{" "}
                                <a
                                    href="https://www.cadmaxatelier.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    https://www.cadmaxatelier.com
                                </a>
                            </p>
                        </Section>

                    </div>
                </div>
            </Layout>
        </>
    );
}

/* Reusable Section Component */
const Section = ({ title, children }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed text-[15px] md:text-base">
                {children}
            </div>
        </div>
    );
};