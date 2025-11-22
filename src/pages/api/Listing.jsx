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
  async Supercategory() {
    return Api.get("/admin/supercategory")
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