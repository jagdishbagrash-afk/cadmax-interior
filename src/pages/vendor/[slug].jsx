import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Index() {
    const router  = useRouter();
console.log("router" ,router.query.slug)
const slug=  router.query.slug;

useEffect(()=>{
    

},[slug])

    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete Interior Design & Execution"}
               />


        </Layout>
    );
}