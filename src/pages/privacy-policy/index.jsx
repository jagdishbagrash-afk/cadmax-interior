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
                    title={" Privacy Policy"}
                    content={" Last Updated: March 2026"}
                />
           <div className="policy-page pt-[20px] pb-[20px]">

                    <div className='mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4'>

                    

                        {/* Sections */}
                        <Section title="1. Introduction">
                            <p className="">
                                Welcome to <span className="font-semibold">Cadmax Atelier</span> (“Company”, “we”, “our”, “us”).
                            </p>
                            <p className="mt-3 ">
                                We value your privacy and are committed to protecting your personal information.
                            </p>
                            <p className="mt-3 ">
                               This Privacy Policy explains how we collect, use, store, and protect your information when you access our website, services, or interact with our platform.
                            </p>
                            <p className="mt-3">
By accessing our website or using our services, you agree to the terms of this Privacy Policy.

                            </p>
                        </Section>

                        <Section title="2. Information We Collect">
                            <p>
                                We may collect the following types of information when you use our website or services.

                            </p>
                            <h3 className="mt-3 mb-3 font-medium">Personal Information:</h3>
                            <ul className="">
                                <li>Full Name</li>
                                <li>Email Address</li>
                                <li>Phone Number</li>
                                <li>Address or Project Location</li>
                                <li>Interior project details</li>
                                <li>Payment/Billing info (via secure gateways)</li>
                            </ul>

                            <h3 className="mt-5 mb-3 font-medium">Non-Personal Information:</h3>
                            <p>
                                We may also collect certain technical information automatically:

                                </p>
                            <ul className="">
                                <li>IP Address</li>
                                <li>Browser Type</li>
                                <li>Device Information</li>
                                <li>Usage Data</li>
                                <li>Cookies & Analytics</li>
                            </ul>
                        </Section>

                        <Section title="3. How We Use Your Information">
                                <p>
                                We may also collect certain technical information automatically:

                                </p>
                            <ul className="">
                                <li>Provide interior design services</li>
                                <li>Respond to inquiries</li>
                                <li>Process payments</li>
                                <li>Improve website experience</li>
                                <li>Send updates and communication</li>
                                <li>Send promotions (if opted-in)</li>
                            </ul>
                        </Section>

                        <Section title="4. Cookies">
                            <p>
                           Our website may use cookies to improve user experience and analyze website traffic.

                            </p>
                            <p className="mt-3">
                               Cookies help us understand how visitors interact with our website and allow us to improve our services.

                            </p>

                                <p className="mt-3">
                              You can choose to disable cookies through your browser settings.


                            </p>
                        </Section>

                        <Section title="5. Sharing of Information">
                            <p className="mb-3">
                                We do not sell or rent your personal information.
                            </p>
                            <p className="mb-3">However, we may share information with trusted third parties such as:
</p>
                            <ul className="">
                                <li>Payment providers</li>
                                <li>Delivery/logistics partners</li>
                                <li>Tech service providers</li>
                                <li>Project contractors</li>
                                <li>Legal authorities (if required)</li>
                            </ul>
                            <p>

                                All partners are required to maintain confidentiality of your information.

                            </p>
                        </Section>

                        <Section title="6. Data Security">
                            <p>
                               We implement appropriate security measures to protect your personal data from unauthorized access, misuse, or disclosure.

                            </p>
                            <p className="mt-3">
                               However, please note that no internet transmission is completely secure.

                            </p>
                        </Section>

                        <Section title="7. Data Retention">
                            <p>
                              We retain your personal information only for as long as necessary to:

                            </p>

                              <ul className="">
                                <li>Provide our services</li>
                                <li>Maintain business records</li>
                                <li>Comply with legal obligations
</li>
                            </ul>

                              <p>
                            After that period, the information may be securely deleted.


                            </p>
                        </Section>

                        <Section title="8. Third-Party Links">
                            <p>
                                Our website may contain links to third-party websites.

                            </p>
                            <p>
We are not responsible for the privacy policies or practices of those websites.

                            </p>
                        </Section>

                        <Section title="9. Children’s Privacy">
                            <p>
                               Our services are not intended for children under the age of 13 years, and we do not knowingly collect personal information from children.

                            </p>
                        </Section>

                        <Section title="10. Your Rights">
                            <p>
                                You may request to:

                            </p>
                            <ul className="">
                                <li>Access your data</li>
                                <li>Correct your data</li>
                                <li>Request deletion</li>
                            </ul>
                            <p className="mt-3">
                               To make such a request, please contact us using the details below.

                            </p>
                        </Section>

                        <Section title="11. Changes to Policy">
                            <p>
                               Cadmax Atelier may update this Privacy Policy from time to time.

                            </p>
                            <p>
Any changes will be posted on this page with the updated date.

                            </p>
                        </Section>

                        <Section title="12. Contact Us">
                            <p>If you have any questions regarding this Privacy Policy, please contact us:
</p>
                            <p className="mb-2 font-medium ">Cadmax Atelier</p>

                            {/* Email */}
                            <p className=" ">
                                Email:{" "}
                                <a
                                    href="mailto:support@cadmaxatelier.com"
                                    className="text-blue-600 hover:underline"
                                >
                                    support@cadmaxatelier.com
                                </a>
                            </p>

                            {/* Website */}
                            <p className="mt-2 ">
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
const   Section = ({ title, children }) => {
    return (
        <div className="mb-8">
            <h2 className=" mt-2 mb-2">
                {title}
            </h2>
            <p className="">
                {children}
            </p>
        </div>
    );
};