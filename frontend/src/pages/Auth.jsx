import { useState } from "react";
import Tabs from "../components/Auth/Tabs";
import AdminLogin from "../components/Auth/AdminLogin";
import VisitorLogin from "../components/Auth/VisitorLogin";

const Auth = () => {
  const [tab, setTab] = useState("visitor");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col bg-white rounded-md p-2">
        <Tabs setTab={setTab} />
        <div className="w-96 bg-white shadow-lg p-8 rounded-md">
          {tab === "admin" ? (
            <AdminLogin />
          ) : (
            <>
              <VisitorLogin />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
