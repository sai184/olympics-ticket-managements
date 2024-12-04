/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = "http://localhost:3000";
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, [token, isAdmin]);
  const contextvalue = {
    backendUrl,
    token,
    setToken,
    isAdmin,
    setIsAdmin,
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
