"use client";
import React, { useState } from "react";
import Layout from "../common/Layout";
import ProductImage from "../../Assets/Images/ProductDetail.png";
import Image from "next/image";
import { FiTruck } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import Related from "../product/Related";

export default function Index() {
  const [qty, setQty] = useState(1);

  const [open, setOpen] = useState(null);

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <Layout>
      <Related />
    </Layout>
  );
}