import { Component } from "react";
import { Api, ApiallowFile } from "./Api";

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


  async deleteSubCategory(id) {
    return Api.get(`/subcategory/delete/${id}`);
  }

  async deleteCategory(id) {
    return Api.get(`/category/delete/${id}`);
  }


  async subcategoryList() {
    return Api.get("/subcategory/get",)
  }

  async VendorGet() {
    return Api.get("/vendor/get",)
  }

  async getSubcategorybyCategory(id) {
    return Api.get(`/subcategory/category/${id}`)
  }

  async subcategoryStatus() {
    return Api.get("/subcategory/get-status",)
  }

  async Subcategorydelete(id) {
    return Api.get(`/subcategory/status/${id}`)
  }

  async SubcategoryUpdate(id, formData) {
    return Api.post(`/subcategory/update/${id}`, formData);
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

    async LeadStatusUpdate(id ,status) {
    return Api.post(`/lead-status-update/${id}` ,status);
  }

  async getProductbySubcategory(id) {
    return Api.get(`/product/subcategory/${id}`);
  }

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

  async GetAllProductsId(id) {
    return Api.get(`/product/details/${id}`,);
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

  async PaymentSave(data) {
    return Api.post("/verify-payment", data)
  }
  async DeleteImageUrl(data) {
    return Api.post("/common/delete-image", data)

  }

  async deleteProjectImage(id, data) {
    return Api.post(`/project/delete-image/${id}`, data)

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