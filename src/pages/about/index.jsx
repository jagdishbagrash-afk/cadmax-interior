import React from "react";
import Link from "next/link";
import Layout from "../common/Layout";
import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";
import Features from "./Features";
import { FaArrowRight, FaBuilding, FaLeaf, FaRulerCombined, FaUsers } from "react-icons/fa";

const stats = [
    { label: "Design Projects", value: "1200+", icon: <FaBuilding /> },
    { label: "Trusted Vendors", value: "350+", icon: <FaUsers /> },
    { label: "Interior Concepts", value: "250+", icon: <FaRulerCombined /> },
    { label: "Sustainable Focus", value: "100%", icon: <FaLeaf /> },
];

const values = [
    "Curated collections that blend aesthetics with functionality.",
    "Transparent partnerships with trusted vendors and craftsmen.",
    "Design-first thinking that turns every room into an experience.",
    "Personalized guidance from discovery to final styling.",
];

export default function About() {
    return (
        <Layout>
            <div className="bg-[#f7f3ee] text-[#171717]">
                <Banner Slider1={ProductListBanner} title="About Us" />

                <section className="container max-w-[1430px] mx-auto px-4 py-14 md:py-20">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                        <div>
                            <span className="inline-flex items-center rounded-full border border-[#d8b98a] bg-[#f6ead7] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a4f1d]">
                                Our Story
                            </span>
                            <h1 className="mt-5 text-3xl font-black leading-tight text-[#171717] md:text-5xl">
                                Designing Spaces, Creating Experiences
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-[#4d5466] md:text-lg">
                                Cadmax Atelier brings together premium interior products, curated design inspiration, and trusted craftsmanship so every home feels refined, personal, and effortlessly beautiful.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/product"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#2d2d2d]"
                                >
                                    Explore Products
                                    <FaArrowRight className="text-xs" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center rounded-full border border-[#17171733] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#171717] transition hover:border-[#171717]"
                                >
                                    Talk to Us
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="overflow-hidden rounded-[28px] border border-[#e5ddd6] bg-white p-3 shadow-[0_25px_60px_rgba(23,23,23,0.08)]">
                                <img
                                    src="/commercial.jpeg"
                                    alt="Interior design inspiration"
                                    className="h-[440px] w-full rounded-[22px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-5 left-5 rounded-2xl border border-[#e6d7c0] bg-[#fffaf3] p-4 shadow-lg">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6030]">Since 2024</p>
                                <p className="mt-2 text-2xl font-black text-[#171717]">11+ yrs</p>
                                <p className="text-sm text-[#4d5466]">Design expertise</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-[#eae2d9] bg-white">
                    <div className="container max-w-[1430px] mx-auto grid gap-5 px-4 py-8 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-[#efe5db] bg-[#fdfaf7] p-5">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#171717] text-lg text-[#f9d7a1]">
                                    {item.icon}
                                </div>
                                <p className="text-2xl font-black text-[#171717]">{item.value}</p>
                                <p className="mt-2 text-sm font-medium text-[#4d5466]">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container max-w-[1430px] mx-auto px-4 py-16 md:py-20">
                    <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative">
                            <img src="/ligithing.jpg" alt="Modern interior styling" className="h-[520px] w-full rounded-[28px] object-cover" />
                            <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/30 bg-[#171717]/70 p-4 text-white backdrop-blur-sm">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f0d39a]">Crafted Living</p>
                                <p className="mt-2 text-lg font-semibold">Thoughtful interiors for modern lifestyles</p>
                            </div>
                        </div>

                        <div>
                            <span className="inline-flex rounded-full border border-[#d9c5a1] bg-[#faf1e5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#775328]">
                                Why Cadmax Atelier
                            </span>
                            <h2 className="mt-5 text-3xl font-black text-[#171717] md:text-4xl">
                                Built around quality, trust, and design clarity
                            </h2>
                            <p className="mt-4 text-base leading-7 text-[#4d5466]">
                                We believe beautiful interiors should feel effortless. That is why we source products that are premium in finish, practical in use, and timeless in design.
                            </p>

                            <ul className="mt-8 space-y-4">
                                {values.map((item) => (
                                    <li key={item} className="flex items-start gap-3 rounded-xl border border-[#eee3d8] bg-white p-4">
                                        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-[#f0d39a]">
                                            ✓
                                        </span>
                                        <span className="text-sm leading-6 text-[#3d4652]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <Features />

                <section className="container max-w-[1430px] mx-auto px-4 pb-20 pt-4 md:pb-24">
                    <div className="rounded-[30px] border border-[#eadcc8] bg-gradient-to-r from-[#171717] via-[#232323] to-[#0f0f0f] p-8 text-white md:p-12">
                        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#eec98d]">Our promise</p>
                                <h3 className="mt-3 text-3xl font-black md:text-4xl">Let’s craft a home that feels uniquely yours.</h3>
                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full bg-[#f4d09d] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#171717] transition hover:bg-[#f0c57f]"
                            >
                                Book a Consultation
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}