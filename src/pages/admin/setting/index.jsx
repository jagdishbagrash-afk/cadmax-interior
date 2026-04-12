import React, { useState } from "react";
import AdminLayout from "../common/AdminLayout";
import AdminManage from "./AdminManage";
import Terms from "./Terms";
import Privacy from "./Privacy";
import ProfileIndex from "./ProfileIndex";

export default function Index() {
  const [activeTab, setActiveTab] = useState("Profile");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <AdminLayout page={"Settings"}>
      <div className="flex md:flex-wrap overflow-x-auto whitespace-nowrap space-x-3 md:space-x-0 border-b border-[rgba(0,0,0,.1)] px-3 md:px-8 lg:px-8 xl:px-12 pt-2">
        <button
          onClick={() => handleTabClick("Profile")}
          className={` cursor-pointer tracking-[-0.04em] font-medium  px-2 md:px-4 lg:px-3 xl:px-8 pt-3 lg:pt-4 pb-3 lg:pb-4 text-sm sm:text-base 
             xl:text-xl outline-none focus:outline-none ease-linear transition-all border-b duration-150 ${activeTab === "Profile"
              ? "text-[#000000] border-[#CC2828]"
              : "text-[#535353]  border-[rgba(0,0,0,.0)] "
            }`}
        >
          Profile
        </button>
        
        <button
          onClick={() => handleTabClick("password")}
          className={` cursor-pointer tracking-[-0.04em] font-medium  px-2 md:px-4 lg:px-3 xl:px-8 pt-3 lg:pt-4 pb-3 lg:pb-4 text-sm sm:text-base 
             xl:text-xl outline-none focus:outline-none ease-linear transition-all border-b duration-150  ${activeTab === "password"
              ? "text-[#000000] border-[#CC2828]"
              : "text-[#535353]  border-[rgba(0,0,0,.0)] "
            }`}
        >
          Password
        </button>
     
        <button
          onClick={() => handleTabClick("term")}
          className={` cursor-pointer tracking-[-0.04em] font-medium  px-2 md:px-4 lg:px-3 xl:px-8 pt-3 lg:pt-4 pb-3 lg:pb-4 text-sm 
            sm:text-base  xl:text-xl outline-none focus:outline-none ease-linear transition-all border-b duration-150  
            ${activeTab === "term"
              ? "text-[#000000] border-[#CC2828]"
              : "text-[#535353]  border-[rgba(0,0,0,.0)] "
            }`}
        >
          Terms & Conditions
        </button>

        <button
          onClick={() => handleTabClick("privacy")}
          className={` cursor-pointer tracking-[-0.04em] font-medium  px-2 md:px-4 lg:px-3 xl:px-8 pt-3 lg:pt-4 pb-3 
            lg:pb-4 text-sm sm:text-base  xl:text-xl outline-none focus:outline-none ease-linear transition-all 
            border-b duration-150  ${activeTab === "privacy"
              ? "text-[#000000] border-[#CC2828]"
              : "text-[#535353]  border-[rgba(0,0,0,.0)] "
            }`}
        >
          Privacy Policy
        </button>
      </div>
      <div className="px-3 md:px-8 lg:px-8 xl:px-12 pb-6 lg:pb-[30px] min-h-[75vh]">
        <div className="mt-0">
          {activeTab === "Profile" && <ProfileIndex />}
          {activeTab === "term" && <Terms />}
          {activeTab === "privacy" && <Privacy />}
        </div>
      </div>
    </AdminLayout>
  );
}
