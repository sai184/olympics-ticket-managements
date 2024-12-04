import { useState } from "react";
import Tabs from "../components/Auth/Tabs";
import AdminLogin from "../components/Auth/AdminLogin";
import VisitorLogin from "../components/Auth/VisitorLogin";

const Auth = () => {
  const [tab, setTab] = useState("visitor");

  return (
    <div className="flex h-screen bg-[#2b293d]">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-start bg-[#2b293d] text-white w-1/2 px-16">
        <h1 className="text-4xl font-bold mb-4">Discover tailored events.</h1>
        <p className="text-lg mb-6">
          Visit for personalized recommendations today!
        </p>
        <div className="text-yellow-400 text-3xl font-bold fixed top-9 left-6">
          Ticket Bookings
        </div>
      </div>
      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white rounded-l-3xl">
        <div className="flex flex-col bg-white p-6 rounded-md">
          <Tabs setTab={setTab} />
          <div className="w-[400px] bg-gray-50 shadow-md p-8 rounded-lg">
            {tab === "admin" ? <AdminLogin /> : <VisitorLogin />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
