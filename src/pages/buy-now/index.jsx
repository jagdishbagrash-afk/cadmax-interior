import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import Banner from "@/components/Banner";
import BannerImages from "../../Assets/Images/Frame18.jpg";
import { useRazorpay } from "react-razorpay";
import Link from "next/link";
import { formatPrice } from "@/components/formatPrice";

import {
  extractOrderAndShipment,
  buildTransitDisplay,
  formatTransitDate,
  buildDeliveryDateRange,
} from "@/components/shipmentUtils";

import {
  FiShield,
  FiTruck,
  FiAward,
  FiHeadphones,
  FiArrowRight,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiPhone,
  FiClock,
  FiCheck,
} from "react-icons/fi";

import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function Index() {
  const { Razorpay } = useRazorpay();
  const router = useRouter();
  const { user } = useRole();

  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;

  // ============================================================
  // STATES
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState(null);

  const [data, setData] = useState([]);

  const [paymentMethod, setPaymentMethod] =
    useState("ONLINE");

  // NEW
  const [checkoutStep, setCheckoutStep] = useState(1);

  const [transitTimeResponse, setTransitTimeResponse] =
    useState(null);

  const [transitTimeLoading, setTransitTimeLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    addressId: "",
  });

  // ============================================================
  // SELECTED ADDRESS
  // ============================================================

  const selectedAddress = data.find(
    (item) => item._id === formData.addressId
  );

  const selectedAddressText = selectedAddress
    ? `${selectedAddress.street_address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.pincode} (${selectedAddress.addressType || "Address"})`
    : "";

  // ============================================================
  // PAYMENT METHOD FROM URL
  // ============================================================

  useEffect(() => {
    const queryValue =
      router.query.paymentMethod ||
      router.query.payment_method ||
      "";

    const pm =
      String(
        Array.isArray(queryValue)
          ? queryValue[0]
          : queryValue
      )
        .trim()
        .toUpperCase() === "COD"
        ? "COD"
        : "ONLINE";

    setPaymentMethod(pm);
  }, [
    router.query.paymentMethod,
    router.query.payment_method,
  ]);
  const getProductImage = (item) => {
    if (!item) return "";

    const image =
      item?.selectedVariant?.images?.[0] ||
      item?.selectedColor?.images?.[0] ||
      item?.images?.[0] ||
      item?.image ||
      item?.product?.images?.[0] ||
      item?.product?.image ||
      "";

    // if image is already string
    if (typeof image === "string") {
      return image;
    }

    // if image is object
    return (
      image?.url ||
      image?.image ||
      image?.src ||
      image?.path ||
      ""
    );
  };
  // ============================================================
  // ORDER PRODUCTS
  // ============================================================

  const buildOrderProducts = () => {
    if (!product) return [];
    const productImage = getProductImage(product);
    console.log("ONLINE PRODUCT DATA BEFORE API:", JSON.stringify(productImage, null, 2));
    return [
      {
        id: product.productId || product.id,
        sku: product.productId || product.id,
        title: product.name,
        name: product.name,
        // ADD IMAGE
        image: productImage,

        // optional - useful for future
        images: productImage ? [productImage] : [],
        price:
          product.final_amount ??
          product.price ??
          0,

        originalPrice:
          product.originalPrice ?? 0,

        discount:
          product.discount_amount ?? 0,

        quantity:
          product.quantity ?? 1,

        total:
          (product.final_amount ??
            product.price ??
            0) *
          (product.quantity ?? 1),

        variant: product.variant,
        variantTitle: product.variant,

        priceSection:
          product.selectedPriceSection || null,

        priceSectionTitle:
          product.selectedPriceSection?.title || "",

        size:
          product.selectedSize?.title || "",

        dimensions:
          product.dimensions ||
          product.product?.dimensions,

        product:
          product.product || null,
      },
    ];
  };

  // ============================================================
  // FETCH BUY NOW PRODUCT
  // ============================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedItem =
      localStorage.getItem("buyNowItem");

    if (!storedItem) {
      router.push("/");
      return;
    }

    try {
      const item = JSON.parse(storedItem);

      if (!item) {
        router.push("/");
        return;
      }

      setProduct(item);
    } catch (error) {
      console.error(
        "Invalid buyNowItem:",
        error
      );

      router.push("/");
    }
  }, []);

  // ============================================================
  // USER DETAILS
  // ============================================================

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,

        name:
          user?.name || "",

        mobile:
          user?.phone
            ? String(user.phone)
            : "",
      }));
    }
  }, [user]);

  // ============================================================
  // FETCH ADDRESS
  // ============================================================

  const fetchAddress = async () => {
    try {
      const main = new Listing();

      const response =
        await main.AddressList();

      if (
        response?.data?.data?.addresses
      ) {
        setData(
          response.data.data.addresses
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);

      setData([]);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // ============================================================
  // COD CHECK
  // ============================================================

  const isCOD =
    paymentMethod === "COD";

  // ============================================================
  // DELIVERY ETA
  // ============================================================

  const fetchTransitTime = async (
    targetAddress,
    isCodFlag
  ) => {
    const toPincode =
      targetAddress?.pincode;

    if (
      !toPincode ||
      String(toPincode)
        .trim()
        .length < 6
    ) {
      setTransitTimeResponse(null);

      return;
    }

    setTransitTimeLoading(true);

    try {
      const main = new Listing();

      const response =
        await main.GetTransitTimeByPincode(
          {
            toPincode:
              String(
                toPincode
              ).trim(),

            fromPincode:
              "302001",

            isCod:
              Boolean(isCodFlag),
          }
        );

      setTransitTimeResponse(
        response
      );
    } catch (err) {
      console.error(
        "BUY-NOW TRANSIT TIME FETCH ERROR:",
        err?.response?.data ||
        err?.message
      );

      setTransitTimeResponse(null);
    } finally {
      setTransitTimeLoading(false);
    }
  };

  useEffect(() => {
    fetchTransitTime(
      selectedAddress,
      isCOD
    );
  }, [
    formData.addressId,
    paymentMethod,
  ]);

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    if (name === "mobile") {
      if (
        value.length <= 10 &&
        /^[0-9]*$/.test(value)
      ) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ============================================================
  // PRICE
  // ============================================================

  const subtotal =
    (product?.originalPrice || 0) *
    (product?.quantity || 1);

  const discountTotal =
    (product?.discount_amount ||
      0) *
    (product?.quantity || 1);

  const finalTotal =
    (product?.final_amount || 0) *
    (product?.quantity || 1);

  const additionalDiscount =
    subtotal * 0.1;

  // ============================================================
  // STEP 1 -> STEP 2
  // ============================================================

  const handleContinueToPayment = () => {
    if (
      !formData.name ||
      !formData.name.trim()
    ) {
      toast.error(
        "Please enter your full name"
      );

      return;
    }

    if (
      String(
        formData.mobile
      ).length !== 10
    ) {
      toast.error(
        "Mobile number must be exactly 10 digits"
      );

      return;
    }

    if (!formData.addressId) {
      toast.error(
        "Please select a delivery address"
      );

      return;
    }

    if (!selectedAddress) {
      toast.error(
        "Selected address not found"
      );

      return;
    }

    setCheckoutStep(2);

    if (
      typeof window !== "undefined"
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ============================================================
  // PAYMENT CREATE
  // ============================================================

  const handlePaymentCreateSubmit =
    async (e) => {
      e.preventDefault();

      if (!product) {
        toast.error(
          "Product not found"
        );

        return;
      }

      if (
        !formData.name?.trim()
      ) {
        toast.error(
          "Please enter your name"
        );

        setCheckoutStep(1);

        return;
      }

      if (
        String(
          formData.mobile
        ).length !== 10
      ) {
        toast.error(
          "Mobile number must be exactly 10 digits"
        );

        setCheckoutStep(1);

        return;
      }

      if (!formData.addressId) {
        toast.error(
          "Please select delivery address"
        );

        setCheckoutStep(1);

        return;
      }

      // COD
      if (
        paymentMethod === "COD"
      ) {
        await handleCODSubmit();

        return;
      }

      // ONLINE PAYMENT
      setLoading(true);

      try {
        const main =
          new Listing();

        const res =
          await main.AddPaymentCreate(
            {
              amount:
                finalTotal,

              currency:
                "INR",

              receipt:
                `receipt-${Date.now()}`,
            }
          );

        if (
          res?.data?.orderId
        ) {
          const options = {
            key:
              RAZOPAY_KEY,

            amount:
              Math.round(
                finalTotal *
                100
              ),

            currency:
              "INR",

            name:
              "SR Electronics",

            description:
              "Product Payment",

            order_id:
              res.data.orderId,

            handler:
              function (
                response
              ) {
                handleSubmit(
                  response
                );

                toast.success(
                  "Payment Successful"
                );
              },

            prefill: {
              name:
                formData.name,

              contact:
                formData.mobile,
            },

            theme: {
              color:
                "#0f172a",
            },
          };

          const rzp =
            new Razorpay(
              options
            );

          rzp.on(
            "payment.failed",
            function (
              response
            ) {
              console.log(
                "PAYMENT FAILED:",
                response
              );

              router.push(
                "/cancel"
              );
            }
          );

          rzp.open();
        } else {
          toast.error(
            "Unable to create payment order"
          );
        }
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          error?.response
            ?.data?.message ||
          "Payment failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // COD ORDER
  // ============================================================

  const handleCODSubmit =
    async () => {
      try {
        setLoading(true);

        const main =
          new Listing();

        const productData =
          buildOrderProducts();
        console.log(
          "FINAL PRODUCT DATA BEFORE API:",
          JSON.stringify(productData, null, 2)
        );
        const res =
          await main.AddOrder(
            {
              name:
                formData.name,

              mobile:
                formData.mobile,

              addressId:
                formData.addressId,

              address:
                selectedAddressText,

              product:
                productData,

              subtotal,

              discountAmount:
                discountTotal,

              amount:
                finalTotal,

              paymentMethod:
                "COD",

              paymentStatus:
                "PENDING",

              PaymentId:
                "",
            }
          );

        if (
          !res?.data?.status
        ) {
          toast.error(
            res?.data
              ?.message ||
            "COD order failed"
          );

          return;
        }

        const orderId =
          res?.data?.data
            ?.order?._id;

        if (!orderId) {
          toast.error(
            "Order ID not received"
          );

          return;
        }

        await saveCODShipment(
          orderId
        );
      } catch (error) {
        console.error(
          "COD order error:",
          error?.response
            ?.data ||
          error
        );

        toast.error(
          error?.response
            ?.data?.message ||
          "COD order failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // COD SHIPMENT
  // ============================================================

  const saveCODShipment =
    async (orderId) => {
      try {
        const main =
          new Listing();

        const shippingProvider =
          process.env
            .NEXT_PUBLIC_SHIPPING_PROVIDER;

        const response =
          await main.VerifyPayment(
            {
              order_id:
                `COD-${orderId}`,

              payment_id:
                "",

              currency:
                "INR",

              product_name: [
                product?.name,
              ],

              amount:
                finalTotal,

              type:
                "product",

              payment_method:
                "COD",

              paymentMethod:
                "COD",

              payment_status:
                "pending",

              PaymentStatus:
                "PENDING",

              cod_amount:
                finalTotal,

              collectable_amount:
                finalTotal,

              OrderID:
                orderId,

              shipping_provider:
                shippingProvider ||
                undefined,
            }
          );

        if (
          !response?.data
            ?.status
        ) {
          toast.error(
            response?.data
              ?.message ||
            "Order created but shipment failed"
          );

          router.push(
            `/success?orderId=${orderId}`
          );

          return;
        }

        const {
          order,
          shipment,
          trackingNumber,
        } =
          extractOrderAndShipment(
            response
          );

        const fallbackOrder =
        {
          ...(order || {}),

          name:
            formData.name,

          mobile:
            formData.mobile,

          addressId:
            formData.addressId,

          address:
            selectedAddressText,

          amount:
            finalTotal,

          product:
            buildOrderProducts(),

          paymentMethod:
            "COD",

          paymentStatus:
            "PENDING",
        };

        if (
          typeof window !==
          "undefined"
        ) {
          sessionStorage.setItem(
            "latestShipmentState",

            JSON.stringify({
              orderId,

              trackingNumber:
                trackingNumber ||
                "",

              order:
                fallbackOrder,

              shipment:
                shipment ||
                null,

              shipToAddress:
                selectedAddress ||
                null,

              paymentMethod:
                "COD",
            })
          );
        }

        localStorage.removeItem(
          "buyNowItem"
        );

        toast.success(
          "Order placed successfully"
        );

        const query =
          new URLSearchParams();

        query.set(
          "orderId",
          orderId
        );

        if (
          trackingNumber
        ) {
          query.set(
            "trackingNumber",
            trackingNumber
          );
        }

        router.push(
          `/success?${query.toString()}`
        );
      } catch (error) {
        console.error(
          "COD shipment error:",
          error?.response
            ?.data ||
          error
        );

        toast.error(
          error?.response
            ?.data?.message ||
          "Order created but shipment generation failed"
        );
      }
    };

  // ============================================================
  // ONLINE ORDER CREATE
  // ============================================================

  const handleSubmit =
    async (
      response,
      options = {}
    ) => {
      try {
        setLoading(true);

        const activePaymentMethod =
          options.paymentMethod ||
          paymentMethod;

        const main =
          new Listing();

        const productData =
          buildOrderProducts();

        const res =
          await main.AddOrder(
            {
              name:
                formData.name,

              mobile:
                formData.mobile,

              addressId:
                formData.addressId,

              address:
                selectedAddressText,

              product:
                productData,

              subtotal,

              discountAmount:
                discountTotal,

              amount:
                finalTotal,

              paymentMethod:
                activePaymentMethod,

              PaymentId:
                response
                  ?.razorpay_payment_id ||
                "",

              orderId:
                response
                  ?.razorpay_order_id ||
                "",
            }
          );

        const createdOrderId =
          res?.data?.data
            ?._id ||
          res?.data?.data
            ?.order?._id ||
          null;

        if (
          !createdOrderId
        ) {
          toast.error(
            "Order creation failed: missing order ID"
          );

          return;
        }

        if (
          res?.data?.status
        ) {
          await savePaymentDetails(
            response
              ?.razorpay_order_id,

            response
              ?.razorpay_payment_id,

            "success",

            createdOrderId,

            {
              razorpaySignature:
                response
                  ?.razorpay_signature,

              paymentMethod:
                activePaymentMethod,
            }
          );
        } else {
          toast.error(
            res?.data
              ?.message ||
            "Order creation failed"
          );
        }
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          "Order failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // SAVE SESSION SHIPMENT
  // ============================================================

  const persistLatestShipmentState =
    ({
      responsePayload,
      orderId,
      fallbackOrder,
      fallbackShipment = null,
      fallbackTrackingNumber = "",
    }) => {
      if (
        typeof window ===
        "undefined"
      )
        return;

      const {
        order,
        shipment,
        trackingNumber,
      } =
        extractOrderAndShipment(
          responsePayload
        );

      sessionStorage.setItem(
        "latestShipmentState",

        JSON.stringify({
          orderId:
            orderId ||
            order?._id ||
            null,

          trackingNumber:
            trackingNumber ||
            fallbackTrackingNumber ||
            "",

          order:
            fallbackOrder ||
            order ||
            null,

          shipment:
            shipment ||
            fallbackShipment ||
            null,

          shipToAddress:
            selectedAddress ||
            null,
        })
      );
    };

  // ============================================================
  // SUCCESS PAGE
  // ============================================================

  const goToSuccessPage =
    ({
      orderId,
      responsePayload,
      fallbackTrackingNumber = "",
    }) => {
      const {
        order,
        trackingNumber,
      } =
        extractOrderAndShipment(
          responsePayload
        );

      const query =
        new URLSearchParams();

      if (
        orderId ||
        order?._id
      ) {
        query.set(
          "orderId",

          orderId ||
          order?._id
        );
      }

      if (
        trackingNumber ||
        fallbackTrackingNumber
      ) {
        query.set(
          "trackingNumber",

          trackingNumber ||
          fallbackTrackingNumber
        );
      }

      router.push(
        query.toString()
          ? `/success?${query.toString()}`
          : "/success"
      );
    };

  // ============================================================
  // VERIFY PAYMENT + SHIPMENT
  // ============================================================

  const savePaymentDetails =
    async (
      orderId,
      paymentId,
      payment_status,
      Orderdatas,
      options = {}
    ) => {
      try {
        const main =
          new Listing();

        const shippingProvider =
          process.env
            .NEXT_PUBLIC_SHIPPING_PROVIDER;

        const activePaymentMethod =
          options.paymentMethod ||
          "ONLINE";

        const razorpaySignature =
          options.razorpaySignature ||
          "";

        if (
          activePaymentMethod ===
          "ONLINE" &&
          (!orderId ||
            !paymentId ||
            !razorpaySignature)
        ) {
          toast.error(
            "Payment verification failed because Razorpay payment details are incomplete."
          );

          return;
        }

        const payload = {
          OrderID:
            Orderdatas,

          amount:
            finalTotal,

          currency:
            "INR",

          payment_status,

          payment_method:
            activePaymentMethod,

          type:
            "product",
        };

        if (
          activePaymentMethod ===
          "ONLINE"
        ) {
          payload.razorpay_order_id =
            orderId;

          payload.razorpay_payment_id =
            paymentId;

          payload.razorpay_signature =
            razorpaySignature;

          if (orderId) {
            payload.order_id =
              orderId;
          }

          if (paymentId) {
            payload.payment_id =
              paymentId;
          }
        }

        if (
          shippingProvider
        ) {
          payload.shipping_provider =
            shippingProvider;
        }

        const response =
          await main.VerifyPayment(
            payload
          );

        const fallbackOrder =
        {
          name:
            formData.name ||
            "",

          mobile:
            formData.mobile ||
            "",

          addressId:
            formData.addressId ||
            "",

          address:
            selectedAddressText ||
            "",

          amount:
            finalTotal ||
            0,

          product:
            buildOrderProducts(),

          paymentMethod:
            activePaymentMethod,

          paymentStatus:
            "PAID",
        };

        if (
          response?.data
            ?.status
        ) {
          const {
            order,
            shipment,
            trackingNumber,
          } =
            extractOrderAndShipment(
              response
            );

          persistLatestShipmentState(
            {
              responsePayload:
                response,

              orderId:
                Orderdatas ||
                order?._id ||
                null,

              fallbackOrder:
              {
                ...fallbackOrder,
                ...(order ||
                  {}),
              },

              fallbackShipment:
                shipment,

              fallbackTrackingNumber:
                trackingNumber ||
                "",
            }
          );

          localStorage.removeItem(
            "buyNowItem"
          );

          toast.success(
            response.data
              .message ||
            "Payment successful"
          );

          goToSuccessPage(
            {
              orderId:
                Orderdatas ||
                order?._id ||
                null,

              responsePayload:
                response,

              fallbackTrackingNumber:
                trackingNumber ||
                "",
            }
          );
        } else {
          persistLatestShipmentState(
            {
              responsePayload:
                response,

              orderId:
                Orderdatas ||
                null,

              fallbackOrder,
            }
          );

          localStorage.removeItem(
            "buyNowItem"
          );

          toast.error(
            response?.data
              ?.message ||
            "Order placed successfully, but shipment creation is pending."
          );

          goToSuccessPage(
            {
              orderId:
                Orderdatas ||
                null,

              responsePayload:
                response,
            }
          );
        }
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          "Payment save failed"
        );
      }
    };

  // ============================================================
  // ETA DISPLAY
  // ============================================================

  const etaDisplay = (() => {
    const display =
      buildTransitDisplay(
        transitTimeResponse
      );

    const deliveryFormatted =
      formatTransitDate(
        display.deliveryDate
      );

    const podFormatted =
      formatTransitDate(
        display.podDate
      );

    const deliveryRange =
      buildDeliveryDateRange(
        display.deliveryDate,
        display.podDate
      );

    const deliveryPincode =
      selectedAddress?.pincode ||
      "";

    let mainDeliveryText =
      "—";

    if (
      deliveryRange &&
      deliveryRange !== "—"
    ) {
      mainDeliveryText =
        deliveryRange;
    } else if (
      deliveryFormatted
    ) {
      mainDeliveryText =
        deliveryFormatted;
    }

    let deliveryByLabel =
      "";

    if (
      deliveryFormatted &&
      !display.isError
    ) {
      deliveryByLabel =
        `Delivery by ${deliveryFormatted}`;
    }

    let podLabel = "";

    if (
      podFormatted &&
      !display.isError
    ) {
      podLabel =
        `POD expected ${podFormatted}`;
    }

    let showCutoffChip =
      false;

    let cutoffLabel = "";

    if (
      display.isAfterCutoff &&
      !display.isError
    ) {
      showCutoffChip =
        true;

      cutoffLabel =
        "Pickup scheduled next business day";
    }

    return {
      ...display,

      deliveryFormatted,

      deliveryRange,

      podFormatted,

      deliveryPincode,

      mainDeliveryText,

      deliveryByLabel,

      podLabel,

      showCutoffChip,

      cutoffLabel,

      hasValidData:
        Boolean(
          transitTimeResponse &&
          !display.isError &&
          (deliveryFormatted ||
            display.destinationCity)
        ),
    };
  })();

  // ============================================================
  // UI
  // ============================================================

  return (
    <Layout>
      <Banner
        Slider1={
          BannerImages
        }
      />

      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10 md:py-14 lg:py-16 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#B8952E] mb-2">
              Secure Checkout
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Complete Your
              Purchase
            </h1>

            <p className="text-gray-500 mt-3">
              Fast, secure
              and easy
              checkout
            </p>
          </div>

          {/* ================================================= */}
          {/* STEPPER */}
          {/* ================================================= */}

          <div className="max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="flex items-center">

              {/* STEP 1 */}

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${checkoutStep >=
                    1
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {checkoutStep >
                    1 ? (
                    <FiCheck />
                  ) : (
                    "1"
                  )}
                </div>

                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Step 1
                  </p>

                  <p className="font-bold text-sm text-slate-900">
                    Delivery
                    Address
                  </p>
                </div>
              </div>

              {/* LINE */}

              <div className="flex-1 mx-3 md:mx-6">
                <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-slate-900 transition-all duration-500 ${checkoutStep >=
                      2
                      ? "w-full"
                      : "w-0"
                      }`}
                  />
                </div>
              </div>

              {/* STEP 2 */}

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${checkoutStep >=
                    2
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  2
                </div>

                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Step 2
                  </p>

                  <p className="font-bold text-sm text-slate-900">
                    Payment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* CHECKOUT CONTENT */}
          {/* ================================================= */}

          <div className="flex flex-col lg:flex-row gap-7 lg:gap-10">

            {/* ================================================= */}
            {/* LEFT */}
            {/* ================================================= */}

            <div className="w-full lg:w-5/12">

              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                {/* =============================================== */}
                {/* STEP 1 */}
                {/* =============================================== */}

                {checkoutStep ===
                  1 && (
                    <>
                      {/* HEADER */}

                      <div className="bg-gradient-to-r from-slate-950 to-slate-800 px-6 md:px-7 py-6">
                        <div className="flex gap-3 items-center">

                          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <FiMapPin className="text-amber-400 w-5 h-5" />
                          </div>

                          <div>
                            <p className="text-gray-400 text-xs font-medium">
                              Step 1
                              of 2
                            </p>

                            <h2 className="text-white text-xl font-bold">
                              Delivery
                              Address
                            </h2>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mt-3">
                          Choose
                          where
                          your
                          order
                          should
                          be
                          delivered.
                        </p>
                      </div>

                      <div className="p-5 sm:p-6 md:p-7 space-y-6">

                        {/* NAME */}

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                            Full Name{" "}
                            <span className="text-red-500">
                              *
                            </span>
                          </label>

                          <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                              type="text"
                              name="name"
                              autoComplete="name"
                              placeholder="Enter your full name"
                              value={
                                formData.name
                              }
                              onChange={
                                handleChange
                              }
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:bg-white focus:border-slate-900 transition-all"
                            />
                          </div>
                        </div>

                        {/* MOBILE */}

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                            Mobile
                            Number{" "}
                            <span className="text-red-500">
                              *
                            </span>
                          </label>

                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                              type="tel"
                              name="mobile"
                              autoComplete="tel"
                              maxLength={
                                10
                              }
                              placeholder="9876543210"
                              value={
                                formData.mobile
                              }
                              onChange={
                                handleChange
                              }
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:bg-white focus:border-slate-900 transition-all"
                            />
                          </div>
                        </div>

                        {/* ADDRESS */}

                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                              Select
                              Address{" "}
                              <span className="text-red-500">
                                *
                              </span>
                            </label>

                            <Link
                              href="/address"
                              className="text-sm font-bold text-[#B8952E] hover:text-black transition"
                            >
                              +
                              Add
                              New
                            </Link>
                          </div>

                          {/* ADDRESS CARDS */}

                          <div className="space-y-3">

                            {data
                              ?.length >
                              0 ? (
                              data.map(
                                (
                                  item
                                ) => {
                                  const selected =
                                    formData.addressId ===
                                    item._id;

                                  return (
                                    <button
                                      key={
                                        item._id
                                      }
                                      type="button"
                                      onClick={() =>
                                        setFormData(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,

                                            addressId:
                                              item._id,
                                          })
                                        )
                                      }
                                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${selected
                                        ? "border-slate-900 bg-slate-50 shadow-md"
                                        : "border-gray-100 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                      <div className="flex gap-3 items-start">

                                        {/* RADIO */}

                                        <div
                                          className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected
                                            ? "border-slate-900"
                                            : "border-gray-300"
                                            }`}
                                        >
                                          {selected && (
                                            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">

                                          <div className="flex justify-between gap-2">

                                            <p className="font-bold text-slate-900 capitalize">
                                              {item.addressType ||
                                                "Delivery Address"}
                                            </p>

                                            {selected && (
                                              <span className="text-[9px] whitespace-nowrap px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                                                SELECTED
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-sm text-gray-600 leading-relaxed mt-1">
                                            {
                                              item.street_address
                                            }
                                          </p>

                                          <p className="text-sm text-gray-500 mt-1">
                                            {
                                              item.city
                                            }
                                            ,{" "}
                                            {
                                              item.state
                                            }
                                          </p>

                                          <p className="text-sm text-gray-500">
                                            {
                                              item.country
                                            }{" "}
                                            -{" "}
                                            <span className="font-semibold text-gray-700">
                                              {
                                                item.pincode
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                }
                              )
                            ) : (
                              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center">
                                <FiMapPin className="w-8 h-8 mx-auto text-gray-300 mb-3" />

                                <p className="font-semibold text-gray-700">
                                  No
                                  saved
                                  address
                                  found
                                </p>

                                <Link
                                  href="/address"
                                  className="inline-block mt-2 text-sm font-bold text-[#B8952E]"
                                >
                                  Add
                                  Delivery
                                  Address
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* DELIVERY ETA */}

                        {formData.addressId && (
                          <div>

                            {etaDisplay.isError ? (
                              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-medium text-amber-800">
                                  {etaDisplay.errorMessage ||
                                    "Unable to estimate delivery time"}
                                </p>
                              </div>
                            ) : transitTimeLoading ? (
                              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex gap-3 items-center">

                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />

                                <p className="text-sm font-semibold text-gray-600">
                                  Checking
                                  delivery
                                  availability...
                                </p>
                              </div>
                            ) : etaDisplay.hasValidData ? (
                              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">

                                <div className="flex gap-3">

                                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FiClock className="w-5 h-5 text-emerald-700" />
                                  </div>

                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                      Estimated
                                      Delivery
                                    </p>

                                    <p className="text-lg font-bold text-emerald-900 mt-1">
                                      {
                                        etaDisplay.mainDeliveryText
                                      }
                                    </p>

                                    {etaDisplay.podLabel && (
                                      <p className="text-xs text-emerald-700 mt-1">
                                        {
                                          etaDisplay.podLabel
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {etaDisplay.showCutoffChip && (
                                  <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-gray-600">
                                    {
                                      etaDisplay.cutoffLabel
                                    }
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* CONTINUE */}

                        <button
                          type="button"
                          onClick={
                            handleContinueToPayment
                          }
                          className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-slate-950 to-slate-800 text-white font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl active:scale-[0.99]"
                        >
                          Continue
                          to
                          Payment

                          <FiArrowRight className="w-5 h-5" />
                        </button>

                        <div className="flex justify-center gap-2 items-center text-xs text-gray-400">
                          <FiShield />

                          Secure
                          checkout
                        </div>
                      </div>
                    </>
                  )}

                {/* =============================================== */}
                {/* STEP 2 */}
                {/* =============================================== */}

                {checkoutStep ===
                  2 && (
                    <form
                      onSubmit={
                        handlePaymentCreateSubmit
                      }
                    >
                      {/* HEADER */}

                      <div className="bg-gradient-to-r from-slate-950 to-slate-800 px-6 md:px-7 py-6">
                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <FiCreditCard className="w-5 h-5 text-amber-400" />
                          </div>

                          <div>
                            <p className="text-gray-400 text-xs">
                              Step
                              2 of
                              2
                            </p>

                            <h2 className="text-xl font-bold text-white">
                              Payment
                            </h2>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mt-3">
                          Choose
                          your
                          preferred
                          payment
                          method.
                        </p>
                      </div>

                      <div className="p-5 sm:p-6 md:p-7">

                        {/* SELECTED ADDRESS */}

                        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">

                          <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                              <FiMapPin className="text-slate-900" />
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="flex justify-between gap-3">

                                <div>
                                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                    Delivering
                                    To
                                  </p>

                                  <p className="font-bold text-slate-900 mt-1">
                                    {
                                      formData.name
                                    }
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setCheckoutStep(
                                      1
                                    )
                                  }
                                  className="text-sm font-bold text-[#B8952E] hover:text-black"
                                >
                                  Change
                                </button>
                              </div>

                              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                {
                                  selectedAddressText
                                }
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                +91{" "}
                                {
                                  formData.mobile
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* PAYMENT TITLE */}

                        <div className="mb-4">
                          <h3 className="font-bold text-slate-900">
                            Select
                            Payment
                            Method
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Choose
                            how
                            you
                            want
                            to
                            pay
                          </p>
                        </div>

                        {/* PAYMENT OPTIONS */}

                        <div className="space-y-3">

                          {/* ONLINE */}

                          <button
                            type="button"
                            onClick={() =>
                              setPaymentMethod(
                                "ONLINE"
                              )
                            }
                            className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${paymentMethod ===
                              "ONLINE"
                              ? "border-slate-900 bg-slate-50 shadow-sm"
                              : "border-gray-100 hover:border-gray-300"
                              }`}
                          >
                            <div className="flex items-center gap-4">

                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod ===
                                  "ONLINE"
                                  ? "bg-slate-900 text-white"
                                  : "bg-gray-100 text-gray-500"
                                  }`}
                              >
                                <FaCreditCard className="w-5 h-5" />
                              </div>

                              <div className="flex-1">

                                <div className="flex items-center gap-2">

                                  <p className="font-bold text-slate-900">
                                    Pay
                                    Online
                                  </p>

                                  <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-1 rounded-full font-bold">
                                    SECURE
                                  </span>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                  UPI,
                                  Credit/Debit
                                  Card,
                                  Net
                                  Banking
                                  &
                                  more
                                </p>
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod ===
                                  "ONLINE"
                                  ? "border-slate-900"
                                  : "border-gray-300"
                                  }`}
                              >
                                {paymentMethod ===
                                  "ONLINE" && (
                                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
                                  )}
                              </div>
                            </div>
                          </button>

                          {/* COD */}

                          {/* <button
                            type="button"
                            onClick={() =>
                              setPaymentMethod(
                                "COD"
                              )
                            }
                            className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${paymentMethod ===
                              "COD"
                              ? "border-slate-900 bg-slate-50 shadow-sm"
                              : "border-gray-100 hover:border-gray-300"
                              }`}
                          >
                            <div className="flex items-center gap-4">

                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod ===
                                  "COD"
                                  ? "bg-slate-900 text-white"
                                  : "bg-gray-100 text-gray-500"
                                  }`}
                              >
                                <FaMoneyBillWave className="w-5 h-5" />
                              </div>

                              <div className="flex-1">

                                <p className="font-bold text-slate-900">
                                  Cash
                                  on
                                  Delivery
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Pay
                                  when
                                  the
                                  order
                                  reaches
                                  your
                                  doorstep
                                </p>
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod ===
                                  "COD"
                                  ? "border-slate-900"
                                  : "border-gray-300"
                                  }`}
                              >
                                {paymentMethod ===
                                  "COD" && (
                                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
                                  )}
                              </div>
                            </div>
                          </button> */}
                        </div>

                        {/* PAYMENT SUMMARY */}

                        <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-200 p-5">

                          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">
                            Payment
                            Summary
                          </h3>

                          <div className="space-y-3">

                            <div className="flex justify-between gap-3">
                              <span className="text-sm text-gray-500">
                                Payment
                                Method
                              </span>

                              <span className="text-sm font-bold text-slate-900 text-right">
                                {isCOD
                                  ? "Cash on Delivery"
                                  : "Online Payment"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-3">
                              <span className="text-sm text-gray-500">
                                Payment
                                Status
                              </span>

                              <span
                                className={`text-sm font-bold text-right ${isCOD
                                  ? "text-amber-600"
                                  : "text-blue-600"
                                  }`}
                              >
                                {isCOD
                                  ? "Pay on Delivery"
                                  : "To be paid online"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* SECURITY */}

                        <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-start gap-3">

                          <FiShield className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />

                          <div>
                            <p className="font-bold text-sm text-emerald-900">
                              {isCOD
                                ? "Safe Cash on Delivery"
                                : "100% Secure Payment"}
                            </p>

                            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                              {isCOD
                                ? "Pay only when your order is delivered."
                                : "Your payment is securely processed using Razorpay."}
                            </p>
                          </div>
                        </div>

                        {/* PAY BUTTON */}

                        <button
                          type="submit"
                          disabled={
                            loading ||
                            !product
                          }
                          className={`w-full mt-7 py-4 rounded-xl px-5 font-bold flex items-center justify-center gap-2 transition-all ${loading ||
                            !product
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-slate-950 to-slate-800 text-white hover:shadow-xl active:scale-[0.99]"
                            }`}
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />

                              Processing...
                            </>
                          ) : (
                            <>
                              {isCOD
                                ? `Place Order • ${formatPrice(
                                  finalTotal,
                                  "INR"
                                )}`
                                : `Pay ${formatPrice(
                                  finalTotal,
                                  "INR"
                                )}`}

                              <FiArrowRight />
                            </>
                          )}
                        </button>

                        {/* BACK */}

                        <button
                          type="button"
                          onClick={() =>
                            setCheckoutStep(
                              1
                            )
                          }
                          className="w-full text-center mt-3 py-2 text-sm font-semibold text-gray-500 hover:text-slate-900 transition"
                        >
                          ←
                          Back
                          to
                          Delivery
                          Address
                        </button>
                      </div>
                    </form>
                  )}
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT ORDER SUMMARY */}
            {/* ================================================= */}

            <div className="w-full lg:w-7/12">

              <div className="lg:sticky lg:top-24">

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                  {/* HEADER */}

                  <div className="bg-gradient-to-r from-slate-950 to-slate-800 px-6 md:px-8 py-6">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                        <FiTruck className="w-5 h-5 text-amber-400" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Order
                          Summary
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                          {product
                            ? "1 item in your order"
                            : "Loading your order..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {product && (
                    <>

                      {/* PRODUCT */}

                      <div className="p-5 md:p-8">

                        <div className="flex flex-col sm:flex-row gap-5">

                          <div className="relative w-full sm:w-36 h-56 sm:h-36 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">

                            <img
                              src={
                                product
                                  ?.images?.[0] ||
                                "/placeholder.png"
                              }
                              alt={
                                product?.name ||
                                "Product"
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">

                            <div className="flex justify-between gap-4 items-start">

                              <div className="flex-1">

                                <h3 className="font-bold text-lg md:text-xl text-slate-900 leading-tight">
                                  {
                                    product?.name
                                  }
                                </h3>

                                {product?.variant && (
                                  <span className="inline-block mt-2 bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
                                    {
                                      product.variant
                                    }
                                  </span>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">

                                {discountTotal >
                                  0 && (
                                    <p className="text-xs text-gray-400 line-through">
                                      {formatPrice(
                                        subtotal,
                                        "INR"
                                      )}
                                    </p>
                                  )}

                                <p className="font-extrabold text-xl md:text-2xl text-slate-900">
                                  {formatPrice(
                                    finalTotal,
                                    "INR"
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm mt-4">

                              {product
                                ?.selectedSize
                                ?.title && (
                                  <div className="flex gap-2">
                                    <span className="text-gray-500">
                                      Category:
                                    </span>

                                    <span className="font-semibold text-slate-900">
                                      {
                                        product
                                          .selectedSize
                                          .title
                                      }
                                    </span>
                                  </div>
                                )}

                              {product
                                ?.selectedPriceSection
                                ?.title && (
                                  <div className="flex gap-2">

                                    <span className="text-gray-500">
                                      Size:
                                    </span>

                                    <span className="font-semibold text-slate-900">
                                      {
                                        product
                                          .selectedPriceSection
                                          .title
                                      }
                                    </span>
                                  </div>
                                )}

                              <div className="flex gap-2">

                                <span className="text-gray-500">
                                  Quantity:
                                </span>

                                <span className="font-semibold text-slate-900">
                                  {
                                    product?.quantity
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="px-5 md:px-8 py-6 bg-gray-50 border-t border-gray-100">

                        <div className="space-y-3">

                          {subtotal >
                            0 && (
                              <div className="flex justify-between">

                                <span className="text-sm text-gray-500">
                                  Price
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                  {formatPrice(
                                    subtotal,
                                    "INR"
                                  )}
                                </span>
                              </div>
                            )}

                          {additionalDiscount >
                            0 && (
                              <div className="flex justify-between">

                                <span className="text-sm text-gray-500">
                                  Discount
                                  (10%)
                                </span>

                                <span className="text-sm font-bold text-emerald-600">
                                  -
                                  {formatPrice(
                                    additionalDiscount,
                                    "INR"
                                  )}
                                </span>
                              </div>
                            )}

                          <div className="flex justify-between">

                            <span className="text-sm text-gray-500">
                              Delivery
                              Charges
                            </span>

                            <span className="text-sm font-bold text-emerald-600">
                              FREE
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PAYMENT INFO */}

                      <div className="px-5 md:px-8 py-5 border-t border-gray-100">

                        <div className="space-y-3">

                          <div className="flex justify-between gap-3">

                            <span className="text-sm text-gray-500">
                              Payment
                              Type
                            </span>

                            <span className="text-sm font-bold text-slate-900 text-right">
                              {checkoutStep ===
                                1
                                ? "Select in next step"
                                : isCOD
                                  ? "Cash on Delivery"
                                  : "Online Payment"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">

                            <span className="text-sm text-gray-500">
                              Status
                            </span>

                            <span
                              className={`text-sm font-bold text-right ${checkoutStep ===
                                1
                                ? "text-gray-500"
                                : isCOD
                                  ? "text-amber-600"
                                  : "text-blue-600"
                                }`}
                            >
                              {checkoutStep ===
                                1
                                ? "Pending Selection"
                                : isCOD
                                  ? "Pay on Delivery"
                                  : "To be paid online"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* TOTAL */}

                      <div className="px-5 md:px-8 py-6 bg-gradient-to-r from-slate-950 to-slate-800">

                        <div className="flex justify-between items-center gap-4">

                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                              Total
                              Amount
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Inclusive
                              of
                              all
                              charges
                            </p>
                          </div>

                          <span className="text-white font-black text-2xl md:text-3xl">
                            {formatPrice(
                              finalTotal,
                              "INR"
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {!product && (
                    <div className="text-center py-16 px-8">

                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

                        <FiTruck className="w-9 h-9 text-gray-400" />
                      </div>

                      <p className="text-gray-500 mb-5">
                        No
                        product
                        found
                      </p>

                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        Continue
                        Shopping

                        <FiArrowRight />
                      </Link>
                    </div>
                  )}
                </div>

                {/* ============================================= */}
                {/* FEATURES */}
                {/* ============================================= */}

                {product && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                    <FeatureBox
                      icon={
                        <FiAward />
                      }
                      title="Premium Quality"
                    />

                    <FeatureBox
                      icon={
                        <FiTruck />
                      }
                      title="Free Delivery"
                    />

                    <FeatureBox
                      icon={
                        <FiShield />
                      }
                      title="Secure Payment"
                    />

                    <FeatureBox
                      icon={
                        <FiHeadphones />
                      }
                      title="Customer Support"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TRUST */}
          {/* ================================================= */}

          <div className="mt-14 md:mt-16 pt-10 border-t border-gray-200">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <TrustBox
                icon={
                  <FiShield />
                }
                title="Secure Payment"
                description="Protected by secure payment processing."
              />

              <TrustBox
                icon={
                  <FiTruck />
                }
                title="Easy Delivery"
                description="Reliable delivery directly to your selected address."
              />

              <TrustBox
                icon={
                  <FiAward />
                }
                title="Quality Products"
                description="Shop trusted products with complete confidence."
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// ============================================================
// FEATURE BOX
// ============================================================

function FeatureBox({
  icon,
  title,
}) {
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-2xl px-3 py-4 text-center">

      <div className="w-10 h-10 mx-auto rounded-xl bg-gray-100 flex items-center justify-center text-slate-900 text-xl mb-2">
        {icon}
      </div>

      <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-900">
        {title}
      </p>
    </div>
  );
}

// ============================================================
// TRUST BOX
// ============================================================

function TrustBox({
  icon,
  title,
  description,
}) {
  return (
    <div className="text-center p-5">

      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center mx-auto text-slate-900 text-2xl mb-4">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900 text-lg">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
}