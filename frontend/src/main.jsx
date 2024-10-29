import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import StoreContextProvider from "./context/StoreContext.jsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StoreContextProvider>
    <App />
  </StoreContextProvider>
);
