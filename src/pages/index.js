import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Index from "./home/Index";
import Layout from "./common/Layout";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <Layout>
      <Toaster />
      <Index />
    </Layout>
  );
}
