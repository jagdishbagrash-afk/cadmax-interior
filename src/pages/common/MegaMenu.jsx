import Aos from 'aos';
import Link from 'next/link';
import { useEffect } from 'react';
// import ProductGrid from '../productlist/ProductGrid'; // यह कॉम्पोनेन्ट इस्तेमाल नहीं हो रहा है
import c1 from "../../Assets/Images/c1.jpg";
import c2 from "../../Assets/Images/c2.jpg";
import c3 from "../../Assets/Images/c3.jpg";
import c4 from "../../Assets/Images/c4.jpg";
import c5 from "../../Assets/Images/c5.jpg";
import { IoIosArrowDown } from 'react-icons/io';

const MegaMenu = () => {
    // ... (Products Data) ...
      const categories = [
          { id: 1, title: 'FURNITURE', image: c4?.src },
          { id: 2, title: 'SOFA & SEATING', image: c3?.src },
          { id: 3, title: 'LAMPS & LIGHTNING', image: c5?.src },
          { id: 4, title: 'UPHOLSTERY', image: c1?.src },
          { id: 5, title: 'HOME DECOR', image: c2?.src },
      ];

    return (
        <li className="group relative">
            <Link
                href="/product"
                className="text-black text-sm font-medium flex items-center gap-1"
            >
                PRODUCT
                <IoIosArrowDown size={14} />
            </Link>
<div className=' absolute bg-white shadow-2xl 
     w-screen                   
                    ml-[calc(-50vw_+_165%)]
                  '
                        data-aos="fade-down"
                data-aos-once="false"
                data-aos-duration="500"
                  > 

            <div
                className="
                       rounded-xl p-10 mt-6  w-screen
                    hidden group-hover:block 
                    z-50  flex justify-center text-center
               
                "
          
            >
                <div className=" mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories &&
                        categories?.map((item, index) => (
                            <div
                                key={item?.id}
                                className="group cursor-pointer"
                                data-aos="fade-up"
                            >
                                <div className="w-full h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden">
                                    <img
                                        src={item?.image}
                                        alt={item?.title}
                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase Creato">
                                    {item?.title}
                                </h3>
                               
                            </div>
                        ))}
                </div>
            </div>
</div>
        </li>
    );
};

export default MegaMenu;