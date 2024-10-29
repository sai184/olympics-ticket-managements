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

            {/* Dropdown Menu */}
            {/* {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    onClick={navigate("/profile")}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </p>

                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )} */}
          </div>
          <img
            // onClick={() => setVisible(true)}
            // src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu Icon"
          />
        </div>
      </div>
      {/* side bar menu for small screen */}
      {/* <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col test-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div> */}
    </>
  );
};

export default Navbar;
