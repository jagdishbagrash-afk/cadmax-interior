import { Component } from "react";
import { Api, ApiallowFile } from "./Api";

class Listing extends Component {
  async Register(data) {
    return Api.post("/user/register", data);
  }
  async TeacherRegister(data) {
    return Api.post("/user/teacher-register", data);
  }
  async Login(data) {
    return Api.post("/user/login", data);
  }
  async profileVerify() {
    return Api.get("/user/profile")
  }
  async AdminDashboard() {
    return Api.get("/admin/dasboard")
  }
  async Supercategory(data) {
    return Api.post("/supercategory/add", data)
  }

  async SupercategoryList() {
    return Api.get("/supercategory/get")
  }

  async Supercategorydelete(id) {
    return Api.get(`/supercategory/status/${id}`)
  }

  async SupercategoryUpdate(id, formData) {
    return Api.post(`/supercategory/update/${id}`, formData);
  }

  async category(data) {
    return Api.post("/category/add", data)
  }
  async categoryList() {
    return Api.get("/category/get",)
  }

  async categorydelete(id) {
    return Api.get(`/category/status/${id}`)
  }

  async subcategory(data) {
    return Api.post("/subcategory/add", data)
  }

  async subcategoryList() {
    return Api.get("/subcategory/get",)
  }


  async Subcategorydelete(id) {
    return Api.get(`/subcategory/status/${id}`)
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