import { Component } from "react";
import { Api, ApiallowFile } from "./Api";

function logShippingApi(stage, payload) {
  console.log(`[DHL/BLUE_DART PRELOAD] ${stage}`, payload);
}

class Listing extends Component {

  async TeacherRegister(data) {
    return Api.post("/user/teacher-register", data);
  }
  async Login(data) {
    return Api.post("/admin/login", data);
  }
  async AdminProfileUpdate(data) {
    return Api.post("/user/edit-profile", data);
  }
  async profileVerify() {
    return Api.get("/user/profile")
  }


  async TokenVerify() {
    return Api.get("/add-notification")
  }



  async AdminDashboard() {
    return Api.get("/admin/dasboard")
  }
  async category(data) {
    return Api.post("/category/add", data)
  }

  async vendorsubcategory(data) {
    return Api.post("/services/subcategory/add", data)
  }



  async vendorcategory(data) {
    return Api.post("/vendor/category/add", data)
  }

  async servicestype(data) {
    return Api.post("/services/type/add", data)
  }


  async services(data) {
    return ApiallowFile.post("/services/add", data)
  }
  async servciestypeList() {
    return Api.get("/services/type/list",)
  }

  async ServicesUpdate(id, formData) {
    return ApiallowFile.post(`/services/edit/${id}`, formData);
  }
  async ServciesList() {
    return Api.get("/services/list",)
  }

  async ServciesType() {
    return Api.get("/services/type",)
  }

  async ServciesDetails(id) {
    return Api.get(`/services/details/${id}`,)
  }
  async Servicesdelete(id) {
    return Api.get(`/services/delete/${id}`)
  }

  async ServicesTypeUpdate(id, formData) {
    return Api.post(`/services/type/edit/${id}`, formData);
  }
  async ServicesTypedelete(id) {
    return Api.get(`/services/type/delete/${id}`)
  }

  async ServiceSubcategorydelete(id) {
    return Api.get(`/services/subcategory/delete/${id}`)
  }

  async vendorcategoryList() {
    return Api.get("/vendor/category/list",)
  }

  async vendorList() {
    return Api.get("/vendor/list",)
  }
  async categoryList() {
    return Api.get("/category/get",)
  }

  async AddressList() {
    return Api.get("/address/list",)
  }

  async DefalutAddressList(id) {
    return Api.get(`/address/default/${id}`,)
  }
  async DeleteAddressList(id) {
    return Api.get(`/address/delete/${id}`,)
  }

  async UpdateAddressUser(id, data) {
    return Api.post(`/address/update/${id}`, data)
  }

  async ServicesSubCategoryList() {
    return Api.get("/services/subcategory/list",)
  }

  async CartGet() {
    return Api.get("/cart/get",)
  }

  async WishlistGet() {
    return Api.get("/wishlist/get")
  }

  async WishlistAdd(productId) {
    return Api.post("/wishlist/add", { productId })
  }

  async WishlistRemove(productId) {
    return Api.post("/wishlist/remove", { productId })
  }

  async WishlistToggle(productId, variantData = {}) {
    return Api.post("/wishlist/toggle", { productId, ...variantData })
  }

  async WishlistDelete(productId) {
    return Api.delete(`/wishlist/delete/${productId}`)
  }

  async CommonProject() {
    return Api.get("/common/project",)
  }

  async vednorcategoryUpdate(id, formData) {
    return Api.post(`/vendor/category/edit/${id}`, formData);
  }

  async vendorCreate(data) {
    return Api.post("/vendor/add", data)
  }

  async vendorUpdate(id, formData) {
    return Api.post(`/vendor/edit/${id}`, formData)
  }
  async categoryStatus() {
    return Api.get("/category/get-status",)
  }

  async categorydelete(id) {
    return Api.get(`/category/status/${id}`)
  }

  async vendordelete(id) {
    return Api.get(`/vendor/delete/${id}`)
  }


  async VendorCategoryList(id) {
    return Api.get(`/category/vendor/${id}`)
  }
  async ProjectSlug(id) {
    return Api.get(`/project-slug/${id}`)
  }

  async VendorSlug(id) {
    return Api.get(`/vendor-slug/${id}`)
  }


  async categoryUpdate(id, formData) {
    return Api.post(`/category/update/${id}`, formData);
  }

  async vendorsubcategoryUpdate(id, formData) {
    return Api.post(`/services/subcategory/edit/${id}`, formData);
  }

  async subcategory(data) {
    return Api.post("/subcategory/add", data)
  }


  async subsubcategory(data) {
    return Api.post("/productsubsubcategory/add", data)
  }

  async deleteSubCategory(id) {
    return Api.get(`/subcategory/delete/${id}`);
  }

  async deleteproductsubsubcategory(id) {
    return Api.get(`/productsubsubcategory/delete/${id}`);
  }

  async deleteCategory(id) {
    return Api.get(`/category/delete/${id}`);
  }


  async subcategoryList() {
    return Api.get("/subcategory/get",)
  }

  async subsubcategoryList() {
    return Api.get("/productsubsubcategory/get",)
  }

  async VendorGet() {
    return Api.get("/vendor/get",)
  }

  async getSubcategorybyCategory(id) {
    return Api.get(`/subcategory/category/${id}`)
  }

  async getproductsubcategory(id) {
    return Api.get(`/productsubsubcategory/subcategory/${id}`)
  }

  async subcategoryStatus() {
    return Api.get("/subcategory/get-status",)
  }

  async Subcategorydelete(id) {
    return Api.get(`/subcategory/status/${id}`)
  }

  async productsubsubcategorystatus(id) {
    return Api.get(`/productsubsubcategory/status/${id}`)
  }

  async SubcategoryUpdate(id, formData) {
    return Api.post(`/subcategory/update/${id}`, formData);
  }

  async productsubsubcategory(id, formData) {
    return Api.post(`/productsubsubcategory/update/${id}`, formData);
  }
  async productAdd(data) {
    return Api.post(`/product/add`, data);
  }

  async getAllproducts(data) {
    return Api.get(`/product/list`, data);
  }

  async deleteimages(id, image, type) {
    return Api.get(`/services/images/delete/${id}/${image}/${type}`)
  }
  async adminGetOrders(data) {
    return Api.get(`/order/getAll`, data);
  }

  async userGetOrders(data) {
    return Api.get(`/order/getbyUser`, data);
  }

  async updateOrderStatus(id, data) {
    return Api.post(`/order/status/update/${id}`, data);
  }

  async deleteProduct(data) {
    return Api.post(`/product/delete/${data}`);
  }

  async getProductbyId(data) {
    return Api.get(`/product/${data}`);
  }

  async editProduct(id, data) {
    return Api.post(`/product/edit/${id}`, data);
  }

  async SubcategoryList(id) {
    return Api.get(`/subcategory/category_name/${id}`,);
  }

  async getProductbyCategory(id) {
    return Api.get(`/product/category/${id}`);
  }


  async LeadDelete(id) {
    return Api.delete(`/lead/delete/${id}`);
  }

  async LeadStatusUpdate(id, status) {
    return Api.post(`/lead-status-update/${id}`, status);
  }

  // async getProductbySubcategory(id) {
  //   return Api.get(`/product/subcategory/${id}`);
  // }

  async getAllProject(data) {
    return Api.get(`/project/list`, data);
  }

  async getAllAdminProject(data) {
    return Api.get(`/admin/project/list`, data);
  }

  async GetAllProdcuctColor(data) {
    return Api.get(`/product/color/by`, data);
  }

  async AddProject(data) {
    return Api.post(`/project/add`, data);
  }

  async AddAddress(data) {
    return Api.post(`/address/add`, data);
  }

  async AddTocart(data) {
    return Api.post(`/cart/add`, data);
  }

  async RemoveCart(productId, variant) {
    return Api.get(
      `/cart/remove/${productId}/${variant}`
    );
  }

  async UpdateTocart(data) {
    return Api.post(`/cart/update`, data);
  }
  async getAllProjectId(id) {
    return Api.get(`/project/details/${id}`,);
  }
  async editProject(id, data) {
    return Api.post(`/project/edit/${id}`, data);
  }
  async deleteProject(data) {
    return Api.post(`/project/delete/${data}`);
  }
  async DeleteAdminUser(data) {
    return Api.get(`/admin/user/delete/${data}`);
  }
  async DeleteUser() {
    return Api.get(`/user/delete`);
  }

  async deleteBanner(data) {
    return Api.post(`/admin/banner/delete/${data}`);
  }

  async getAllProductSubCategroy(id, page, limit, filters = {}) {
    return Api.get(`/product/subcategory/${id}`, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  }

  async GetAllServicesType(id) {
    return Api.get(`/type-services/${id}`,);
  }

  async GetAllConceptType(id) {
    return Api.get(`/services/type-concept/${id}`,);
  }

  async GetAllProductsId(
    slug,
    subcategory,
    subsubcategory,
    type
  ) {
    const params = {};

    if (subcategory) {
      params.subcategory = subcategory;
    }

    if (subsubcategory) {
      params.subsubcategory = subsubcategory;
    }

    if (type) {
      params.type = type;
    }

    return Api.get(`/product/details/${slug}`, {
      params,
    });
  }
  async AddBooking(data) {
    return Api.post(`/add-booking`, data);
  }
  async GetBooking(data) {
    return Api.get(`/get-booking`, data);
  }

  async GetPayment() {
    return Api.get(`/payment-get`,);
  }


  async GetBestSeller(data) {
    return Api.get(`/common/bestseller`, data);
  }

  async GetLastproduct(data) {
    return Api.get(`/common/product`, data);
  }

  async GetVendorData(data) {
    return Api.get(`/vendor/get`, data);
  }

  async GetHomeList(data) {
    return Api.get(`/common/banner`, data);
  }

  async GetContact(data) {
    return Api.get(`/contact-get`, data);
  }
  async AddBanner(data) {
    return Api.post(`/admin/banner/add`, data);
  }
  async GetBanner(data) {
    return Api.get(`/admin/banner/get`, data);
  }

  async EditBanner(id, data) {
    return Api.post(`/admin/banner/edit/${id}`, data);
  }


  async AddressUser(id, data) {
    return Api.get(`/address/user-list/${id}`, data);
  }

  async Register(data) {
    return Api.post("/user/signup", data)
  }

  async SendOTP(data) {
    return Api.post("/user/send_otp", data)
  }

  async UserSendOTP(data) {
    return Api.post("/user/singup/send_otp", data)
  }

  async VerifyOTP(data) {
    return Api.post("/user/otp_verify", data)
  }

  async GetUser() {
    return Api.get(`/admin/alluser`,);
  }

  async VerifyLogin(data) {
    return Api.post("/user/login", data)
  }

  async AddOrder(data) {
    return Api.post("/order/add", data)
  }

  async globalSearch(search) {
    return Api.get("/global-search", {
      params: {
        search: search,
      },
    });
  }
  async AddContact(data) {
    return Api.post("/contact-add", data)
  }

  async AddPostContact(data) {
    return Api.post("/contact-post-add", data)
  }


  async LeadAdd(data) {
    return Api.post("/lead-add", data)
  }

  async Leadget(data) {
    return Api.get("/lead-get", data)
  }
  async AddServicesContact(data) {
    return Api.post("/services/contact-add", data)
  }

  async GetServicesContact(data) {
    return Api.get(`/services/contact-get`, data);
  }

  async Success() {
    return Api.post("/contact-add", data)
  }

  async Addcommon(data) {
    return Api.post("/common/lead-form", data)
  }

  async AddPaymentCreate(data) {
    return Api.post("/create", data)
  }

  // ========== REVIEW APIs ==========
  async AddReview(data) {
    return Api.post("/review/add", data)
  }

  async UpdateReview(reviewId, data) {
    return Api.post(`/review/update/${reviewId}`, data)
  }

  async DeleteReview(reviewId) {
    return Api.post(`/review/delete/${reviewId}`)
  }

  async GetProductReviews(productId, params = {}) {
    return Api.get(`/review/product/${productId}`, { params })
  }

  async GetProductRatingSummary(productId) {
    return Api.get(`/review/rating-summary/${productId}`)
  }

  async MarkHelpful(reviewId) {
    return Api.post(`/review/helpful/${reviewId}`)
  }

  async MarkNotHelpful(reviewId) {
    return Api.post(`/review/not-helpful/${reviewId}`)
  }

  async CheckReviewEligibility(productId) {
    return Api.get(`/review/eligibility/${productId}`)
  }

  async UploadReviewImages(reviewId, formData) {
    return Api.post(`/review/images/upload/${reviewId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  async DeleteReviewImage(reviewId, imageIndex) {
    return Api.post(`/review/images/delete/${reviewId}/${imageIndex}`)
  }

  async PaymentSave(data) {
    logShippingApi("verify-payment request", data);

    try {
      const response = await Api.post("/verify-payment", data);
      logShippingApi("verify-payment response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("verify-payment error", {
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async VerifyPayment(data) {
    logShippingApi("verify-payment request", data);

    try {
      const response = await Api.post("/verify-payment", data);
      logShippingApi("verify-payment response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("verify-payment error", {
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async GetOrderShipment(id) {
    logShippingApi("order shipment request", { orderId: id });

    try {
      const response = await Api.get(`/order/${id}/shipment`);
      logShippingApi("order shipment response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order shipment error", {
        orderId: id,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async GetOrderTracking(id) {
    logShippingApi("order tracking request", { orderId: id });

    try {
      const response = await Api.get(`/order/${id}/tracking`);
      logShippingApi("order tracking response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order tracking error", {
        orderId: id,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async RefreshOrderShipment(id) {
    logShippingApi("order shipment refresh request", { orderId: id });

    try {
      const response = await Api.post(`/order/${id}/shipment/refresh`);
      logShippingApi("order shipment refresh response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order shipment refresh error", {
        orderId: id,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async CancelOrderShipment(id) {
    logShippingApi("order shipment cancel request", { orderId: id });

    try {
      const response = await Api.post(`/order/${id}/shipment/cancel`);
      logShippingApi("order shipment cancel response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order shipment cancel error", {
        orderId: id,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async DispatchOrderShipment(id) {
    logShippingApi("order shipment dispatch request", { orderId: id });

    try {
      const response = await Api.post(`/order/${id}/shipment/dispatch`);
      logShippingApi("order shipment dispatch response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order shipment dispatch error", {
        orderId: id,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async UpdateOrderDeliveryStatus(id, data) {
    logShippingApi("order shipment delivery status request", {
      orderId: id,
      data,
    });

    try {
      const response = await Api.post(`/order/${id}/shipment/delivery-status`, data);
      logShippingApi("order shipment delivery status response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("order shipment delivery status error", {
        orderId: id,
        data,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async GetPublicShipmentTracking(trackingNumber, courier) {
    const params = courier ? { courier } : undefined;
    logShippingApi("public tracking request", {
      trackingNumber,
      params,
    });

    try {
      const response = await Api.get(`/shipment/track/${trackingNumber}`, {
        params,
      });
      logShippingApi("public tracking response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("public tracking error", {
        trackingNumber,
        params,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async GetTransitTimeByPincode(params) {
    const { toPincode, fromPincode = "302001", isCod = false } = params || {};
    const queryParams = {
      toPincode,
      fromPincode,
      isCod: isCod ? "true" : "false",
    };

    logShippingApi("transit-time (pincode) request", queryParams);

    try {
      const response = await Api.get("/shipment/transit-time", {
        params: queryParams,
      });
      logShippingApi("transit-time (pincode) response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("transit-time (pincode) error", {
        params: queryParams,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async GetTransitTimeByOrder(orderId) {
    logShippingApi("transit-time (order) request", { orderId });

    try {
      const response = await Api.get(`/order/${orderId}/shipment/transit-time`);
      logShippingApi("transit-time (order) response", response?.data);
      return response;
    } catch (error) {
      logShippingApi("transit-time (order) error", {
        orderId,
        message: error?.message,
        response: error?.response?.data,
      });
      throw error;
    }
  }

  async DeleteImageUrl(data) {
    return Api.post("/common/delete-image", data)

  }

  async deleteProjectImage(id, data) {
    return Api.post(`/project/delete-image/${id}`, data)

  }


  async orderId(id) {
    return Api.get(`/order/${id}`)
  }


  render() {
    return (
      <div>
        <></>
      </div>
    );
  }
}

export default Listing;
