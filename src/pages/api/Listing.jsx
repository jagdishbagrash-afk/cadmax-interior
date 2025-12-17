import { Component } from "react";
import { Api, ApiallowFile } from "./Api";

class Listing extends Component {

  async TeacherRegister(data) {
    return Api.post("/user/teacher-register", data);
  }
  async Login(data) {
    return Api.post("/admin/login", data);
  }
  async profileVerify() {
    return Api.get("/user/profile")
  }
  async AdminDashboard() {
    return Api.get("/admin/dasboard")
  }
  // async Supercategory(data) {
  //   return Api.post("/supercategory/add", data)
  // }

  // async SupercategoryList() {
  //   return Api.get("/supercategory/get")
  // }

  // async SupercategoryStatus() {
  //   return Api.get("/supercategory/get-status")
  // }

  // async Supercategorydelete(id) {
  //   return Api.get(`/supercategory/status/${id}`)
  // }

  // async SupercategoryUpdate(id, formData) {
  //   return Api.post(`/supercategory/update/${id}`, formData);
  // }

  async category(data) {
    return Api.post("/category/add", data)
  }


  async categoryList() {
    return Api.get("/category/get",)
  }

  async categoryStatus() {
    return Api.get("/category/get-status",)
  }

  async categorydelete(id) {
    return Api.get(`/category/status/${id}`)
  }

  async categoryUpdate(id, formData) {
    return Api.post(`/category/update/${id}`, formData);
  }
  async subcategory(data) {
    return Api.post("/subcategory/add", data)
  }

  async subcategoryList() {
    return Api.get("/subcategory/get",)
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

  async getProductbySubcategory(id) {
    return Api.get(`/product/subcategory/${id}`);
  }

  async getAllProject(data) {
    return Api.get(`/project/list`, data);
  }

  async AddProject(data) {
    return Api.post(`/project/add`, data);
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
 async deleteUser(data) {
    return Api.post(`/user/delete/${data}`);
  }

   async deleteBanner(data) {
    return Api.post(`/banner/delete/${data}`);
  }

  async getAllProductSubCategroy(id) {
    return Api.get(`/product/subcategory/${id}`,);
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

  async Register(data) {
    return Api.post("/user/signup", data)
  }

  async SendOTP(data) {
    return Api.post("/user/send_otp", data)
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

  render() {
    return (
      <div>
        <></>
      </div>
    );
  }
}

export default Listing;