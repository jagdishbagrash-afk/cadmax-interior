import React, { useEffect, useState } from "react";
import ProductList1 from "../../Assets/Images/ProductList1.png";
import ProductList2 from "../../Assets/Images/ProductList2.png";
import ProductList3 from "../../Assets/Images/ProductList3.png";
import ProductList4 from "../../Assets/Images/ProductList4.png";
import ProductCard from "../common/ProductCard";
import Listing from "../api/Listing";

export default function Related({ selectedId }) {
  const[Project,setProject] = useState([])
  
  const fetchProjectData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllProductSubCategroy(selectedId);
      if (response?.data?.status) {
        setProject(response?.data?.data?.data);
      }else{
        setProject([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setProject([]);
    }
  };


  useEffect(() => {
    if (selectedId) {
      fetchProjectData(selectedId);
    }
  }, [selectedId]);

  const products = [
    {
      id: 1,
      title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
      price: "₹68,500",
      image: ProductList1?.src,
    },
    {
      id: 2,
      title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
      price: "₹22,300",
      image: ProductList2?.src,
    },
    {
      id: 3,
      title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
      price: "₹35,750",
      image: ProductList3.src,
    },
    {
      id: 4,
      title: "AURELUM LARGE FORM SCULPTED CERAMIC CENTERPIECE VASE",
      price: "₹85,000",
      image: ProductList4.src,
    },

  ];


  return (
    <div className="mt-8 py-8">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-[#171717] text-2xl font-black Creato uppercase">
          Related Items
        </h2>
        <p className="text-lg text-[#4D5466] font-medium max-w-2xl Creato">
          Similar items in the furniture side of the items, these following
          items also has wide range of categories
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {Project &&
          Project?.map((item) => (
            <ProductCard item={item} />
          ))}
      </div>
    </div>
  );
}
