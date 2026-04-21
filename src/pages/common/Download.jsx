import Image from "next/image";
import ligithing from "../../Assets/Images/ligithing.jpg";
import { HiH2 } from "react-icons/hi2";

export default function Download() {
    return (
        <section className="relative w-full bg-white overflow-hidden py-4 md:py-8">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={ligithing}
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto px-4 max-w-[1430px] rounded-[40px]  flex flex-col md:flex-row items-center justify-between min-h-[500px]">

                {/* Center Content */}
                <div className="flex-1 text-center py-10">
                    <h2 className="text-black text-4xl md:text-6xl font-bold leading-tight mb-6">
                        READY TO KICKSTART? <br />
                        <span>HIT THE DOWNLOAD BUTTON!</span>
                    </h2>

                    <p className="text-black text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                        Download now to unlock your premium tailoring potential and reach new heights.
                    </p>

                    {/* App Store Buttons */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            target="_blank"
                            href="https://play.google.com/store/apps/details?id=com.cadmax.atelier"
                            className="transform transition hover:scale-105"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                className="h-14 w-auto"
                            />
                        </a>
                        <a
                            target="_blank"
                            href="https://apps.apple.com/app/6761532500"
                            className="transform transition hover:scale-105"
                        >
                            <img
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="App Store"
                                className="h-14 w-auto"
                            />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}