import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import Image from "next/image";
import { Disclosure } from '@headlessui/react'
import { BiMinus } from 'react-icons/bi';
import { BsPlusLg } from 'react-icons/bs';
import FormContact from "./FormContact";
export default function Index() {

    const faqs = [
        {
            id: 1,
            question: 'What is your refund policy?',
            answer: `If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.`
        },
        {
            id: 1,
            question: 'How long does it take to get my order?',
            answer: `Most customers can expect to receive their food and supplies within 1 to 3 days. Orders that require prescription approval or personalization may take longer to ship.`
        },
        {
            id: 1,
            question: 'Do you offer technical support?',
            answer: `No.`
        },
        {
            id: 1,
            question: 'How much is shipping?',
            answer: `Orders over $49 ship free! All other orders ship for a flat rate of $4.95.`
        },
        {
            id: 1,
            question: 'How do I contact support?',
            answer: `We offer support over email, and the best way to contact us is through the in-app help menu.`
        }
    ]
    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete Interior Design & Execution"}
                button={"SHOP OUR FURNITURE"} />
            <section className="container mx-auto max-w-[1430px] px-4 py-12 lg:py-20">

                <div className="w-full flex flex-col md:flex-row gap-3">
                    <div className="w-full md:w-2/3">
                        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                            Residential
                        </p>

                        <h2 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-900 mb-4">
                            Interior Design Tailored to Your Lifestyle
                        </h2>

                        <p className="text-gray-600 mb-8 max-w-2xl">
                            We handle end‑to‑end residential interior design for apartments,
                            villas, and independent homes. Whether you seek personalized
                            aesthetics or complete execution with materials and furniture, we
                            deliver structured, transparent, and on‑time solutions.
                        </p>

                        {/* Scope of Work */}
                        <h3 className="font-bold text-lg mb-3">Scope of Work</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            {["2D Space Planning", "3D Visuals", "Working Drawings", "Material Selection", "Site Execution", "Finishing & Decor"].map((item, i) => (
                                <div key={i} className="border rounded-md px-4 py-2 text-sm text-gray-700">
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Areas We Design */}
                        <h3 className="font-bold text-lg mb-3">Areas We Design</h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {["Living Room", "Bedroom", "Kitchen", "Dining", "Bathroom", "Balcony", "Wardrobes", "TV Unit"].map((item, i) => (
                                <span
                                    key={i}
                                    className="border rounded-full px-4 py-1 text-sm text-gray-700"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        {/* How We Can Help */}
                        <h3 className="font-bold text-lg mb-4">How We Can Help</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold mb-1">Consultancy Only</h4>
                                <p className="text-sm text-gray-600">
                                    Design guidance, drawings & material suggestions.
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold mb-1">Turnkey Execution</h4>
                                <p className="text-sm text-gray-600">
                                    Complete design & execution with fixed timelines.
                                </p>
                            </div>
                        </div>
                        <div className="w-full px-4 pt-16 ">
                            <div className="mx-auto  rounded-2xl bg-white p-2 text-lg">
                                <h1 className='text-center text-4xl py-4'>FAQ</h1>
                                {faqs.map((faq) => (
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <div key={faq.id}>
                                                    <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-3 mb-2 text-left font-medium text-black-600">
                                                        <span>{faq.question}</span>
                                                        {open ? <BiMinus /> : <BsPlusLg />}
                                                    </Disclosure.Button>
                                                    {open && (
                                                        <Disclosure.Panel static className="text-gray-500 flex w-full justify-between rounded-lg px-4 mb-2 text-left text-sm font-medium">
                                                            {faq.answer}
                                                        </Disclosure.Panel>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <FormContact />
                    </div>
                </div>
            </section>
            <section className="container mx-auto max-w-[1430px] px-4 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left Content */}
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
                            Commercial Spaces
                        </p>

                        <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
                            Engineered for Flow,<br />
                            Brand Presence & Performance
                        </h1>

                        <p className="text-gray-600 max-w-xl mb-6">
                            Every commercial project is designed to optimize space efficiency,
                            brand visibility, and user experience—while meeting all functional,
                            safety, and aesthetic requirements.
                        </p>

                        <ul className="space-y-2 text-gray-700 mb-8">
                            <li>• 2D Space Planning & Optimization</li>
                            <li>• 3D Modeling & Brand-Centric Visualization</li>
                            <li>• Corporate Offices & Workspaces</li>
                            <li>• Retail Stores & Showrooms</li>
                            <li>• Cafés, Salons & Service Studios</li>
                            <li>• Lighting, Signage & Material Coordination</li>
                        </ul>

                        <button className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition">
                            Get a Quote
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full h-[420px] lg:h-[520px]">
                        <Image
                            src={ProductListBanner?.src} // place image in /public
                            alt="Commercial interior"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                </div>
            </section>

        </Layout>
    );
}