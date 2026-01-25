import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../common/Layout';

export default function PrivacyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy | JapaneseFor.Me – How We Collect & Protect Your Data</title>
                <meta
                    name="description"
                    content="Read the Privacy Policy of JapaneseForMe to understand how we collect, store, and protect your personal information. Learn about data usage, cookies, user rights, and platform security practices."
                />
            </Head>
            <Layout>
                <div className="pt-[132px] md:pt-[140px] lg:pt-[160px] pb-[20px] md:pb-[40px] lg:pb-[60px]">

                    <div className='mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4'>

                        <h1 className="text-[26px] md:text-[32px] font-[900] text-[#171717] mb-6 Creato uppercase">
                            Privacy Policy
                        </h1>

                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            At <strong>JapaneseFor.Me</strong>, we respect your privacy and are committed to
                            protecting your personal information. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your data when you visit or use our
                            platform.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Information We Collect
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            We may collect personal information such as your name, email address, phone
                            number, and payment details when you register, enroll in courses, or contact
                            us. We also collect non-personal data like browser type, IP address, and
                            website usage patterns to improve our services.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            How We Use Your Information
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            Your information is used to provide and manage our services, process
                            payments, improve user experience, send important updates, and ensure
                            platform security. We do not sell or rent your personal data to third
                            parties.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Cookies & Tracking Technologies
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            We use cookies and similar technologies to enhance site functionality,
                            analyze traffic, and personalize content. You can control cookie preferences
                            through your browser settings.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Data Security
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            We implement industry-standard security measures to protect your data from
                            unauthorized access, alteration, or disclosure. However, no method of data
                            transmission over the internet is 100% secure.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Your Rights
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            You have the right to access, update, or delete your personal information. If
                            you wish to exercise these rights, please contact us using the details
                            provided below.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Changes to This Policy
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8] mb-6">
                            We may update this Privacy Policy from time to time. Any changes will be
                            posted on this page with an updated effective date.
                        </p>

                        <h2 className="text-[20px] md:text-[22px] font-[800] text-[#171717] mb-3 Creato uppercase">
                            Contact Us
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-[#555] leading-[1.8]">
                            If you have any questions about this Privacy Policy or our data practices,
                            please contact us at <strong>support@japanesefor.me</strong>.
                        </p>

                    </div>
                </div>
            </Layout>
        </>
    );
}