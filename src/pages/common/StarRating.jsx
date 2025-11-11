import { MdOutlineStarPurple500, MdStarHalf } from "react-icons/md";

function StarRating({ rating=0 }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;

    return (
        <div className="inline-flex items-center gap-[1px]">
            {[...Array(fullStars)].map((_, index) => (
                <MdOutlineStarPurple500 key={`full-${index}`} size={24} className="text-[#c1ac15]" />
            ))}
            {hasHalfStar && <MdStarHalf size={24} className="text-[#c1ac15]" />}
        </div>
    );
}

export default StarRating;