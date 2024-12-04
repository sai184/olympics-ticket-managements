import { Outlet } from "react-router-dom";

import Footer from "../Shared/Footer";
import AdminNavbar from "../Shared/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet /> {/* Nested routes will be rendered here */}
      </main>
      <Footer /> {/* Common Footer */}
    </div>
  );
};

export default AdminLayout;
