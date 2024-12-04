import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets.js";

const Navbar = () => {
  const { token, setToken } = useContext(StoreContext);

  setToken(localStorage.getItem("token"));

  const navigate = useNavigate();

  // const logout = () => {
  //   setToken(null);
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  return (
    <>
      <div className="flex items-center justify-between font-medium bg-slate-900 shadow-md px-2">
        <h2 className="text-2xl font-semibold text-white">
          Olympic Ticket Management
        </h2>
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/events" className="flex flex-col items-center gap-1">
            <p>Events</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>History</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>
        <div className="flex item-center gap-6">
          <div className="group relative">
            <img
              onClick={() => (token ? null : navigate("/"))}
              src={assets.user}
              className="w-5 cursor-pointer"
              alt="Profile"
            />
          </div>
          <img
            // onClick={() => setVisible(true)}
            // src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu Icon"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
