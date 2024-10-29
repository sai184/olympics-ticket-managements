/* eslint-disable react/prop-types */
import { useState } from "react";

const Tabs = ({ setTab }) => {
  const [activeTab, setActiveTab] = useState("visitor");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTab(tab);
  };
  return (
    <div className="flex justify-center my-1">
      <button
        onClick={() => handleTabClick("visitor")}
        className={`text-xs px-4 py-0.5 w-[100%] rounded-sm ${
          activeTab === "visitor" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        User
      </button>
      <button
        onClick={() => handleTabClick("admin")}
        className={`text-xs ml-1 px-4 py-0.5 w-[100%] rounded-sm ${
          activeTab === "admin" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        Admin
      </button>
    </div>
  );
};

export default Tabs;
