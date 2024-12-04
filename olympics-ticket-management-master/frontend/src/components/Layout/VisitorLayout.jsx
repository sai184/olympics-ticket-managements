import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer";
import VisitorNavbar from "../Shared/VisitorNavbar";

const VisitorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <VisitorNavbar />
      <main className="flex-grow">
        <Outlet /> {/* Nested routes will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

export default VisitorLayout;
