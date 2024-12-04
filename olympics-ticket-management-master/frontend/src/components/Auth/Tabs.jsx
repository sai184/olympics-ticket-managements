/* eslint-disable react/prop-types */
import { useState } from "react";

const Tabs = ({ setTab }) => {
  const [activeTab, setActiveTab] = useState("visitor");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTab(tab);
  };
  return (
    <div className="flex justify-center gap-4 bg-gray-100 p-2 rounded-md shadow-sm my-4">
      <button
        onClick={() => handleTabClick("visitor")}
        className={`text-xs px-6 py-2 rounded-md transition ${
          activeTab === "visitor"
            ? "bg-[#2b293d] text-white shadow-md font-bold"
            : "bg-gray-300 text-black"
        }`}
      >
        Visitor
      </button>
      <button
        onClick={() => handleTabClick("admin")}
        className={`text-xs px-6 py-2 rounded-md transition ${
          activeTab === "admin"
            ? "bg-[#2b293d] text-white shadow-md font-bold"
            : "bg-gray-300 text-black"
        }`}
      >
        Admin
      </button>
    </div>
  );
};

export default Tabs;
