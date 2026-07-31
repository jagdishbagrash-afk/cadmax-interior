import React from "react";
import Layout from "@/pages/common/Layout";
import OrderDetailsView from "@/components/OrderDetailsView";

export default function OrderDetailsAliasPage() {
  return (
    <Layout seo={{ title: "Order Details | CADMAX Interior", description: "View your order details and shipping tracking status." }}>
      <OrderDetailsView />
    </Layout>
  );
}
