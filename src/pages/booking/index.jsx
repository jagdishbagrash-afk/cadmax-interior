import Banner from "@/components/Banner";
import Slider1 from "../../Assets/Images/Slider1.png";
import BookingForm from "./BookingForm";
import Layout from "../common/Layout";
function Index() {
    return (<>
        <Layout>
            <Banner Slider1={Slider1} title={"Book Your Design Consultation or Turnkey Interior Package"} />
            <BookingForm />
        </Layout>
    </>);
}

export default Index;