import React from 'react';
import c1 from "../../Assets/Images/c1.jpg";
import c2 from "../../Assets/Images/c2.jpg";
import c3 from "../../Assets/Images/c3.jpg";
import c4 from "../../Assets/Images/c4.jpg";
import c5 from "../../Assets/Images/c5.jpg";

const categories = [
    { id: 1, title: 'FURNITURE', image: c4?.src },
    { id: 2, title: 'SOFA & SEATING', image: c3?.src },
    { id: 3, title: 'LAMPS & LIGHTNING', image: c5?.src },
    { id: 4, title: 'UPHOLSTERY', image: c1?.src },
    { id: 5, title: 'HOME DECOR', image: c2?.src },
];

const CategoryCard = ({ title, image }) => (
    <div className="flex-shrink-0 w-[180px] sm:w-[230px] text-center p-1">

        <div className="w-[180px] h-[250px] sm:w-[250px] sm:h-[350px] rounded-full overflow-hidden relative mx-auto">

            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-center"
            />

            <div className="
        absolute inset-0 
        flex items-center justify-center 
        text-white text-[18px] sm:text-[22px] 
        font-[900] uppercase
        bg-black/40
      ">
                {title}
            </div>

        </div>

    </div>
);





const FeaturedCategories = () => {
    return (
        <section className="bg-[#F6F6F6] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] mb-4 md:mb-6 uppercase Creato">

                    FEATURED CATEGORIES
                </h2>
                <div className="flex space-x-8 sm:space-x-12 overflow-x-auto pb-4 scrollbar-hide md:scrollbar-default -mx-4 sm:mx-0 px-4 sm:px-0         ">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            image={category.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;