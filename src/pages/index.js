import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Index from "./home/Index";
import Layout from "./common/Layout";

export default function Home() {
  return (
    <Layout
          seo={{
        title:
          "Luxury Architects & Interior Designers in Jaipur | CADMAX Atelier",
        description:
          "Leading architecture and interior design studio in Jaipur offering residential architecture, luxury villa design, commercial interiors, and 3D visualization services.",
        canonical: "https://cadmaxatelier.com/",
        url: "https://cadmaxatelier.com/",
      }}

    >
      <Index />
    </Layout>
  );
}