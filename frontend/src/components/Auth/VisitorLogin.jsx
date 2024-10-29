import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VisitorLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setToken, setIsAdmin } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleVisitorLogin = async (e) => {
    e.preventDefault();

    try {
      if (currState === "Login") {
        // Visitor login
        let newUrl = `${backendUrl}/api/visitors/login`;
        const response = await axios.post(newUrl, {
          email: data.email,
          password: data.password,
        });

        if (response.data.success) {
          setToken(response.data.token);

          // Set token in localStorage
          localStorage.setItem("token", response.data.token);
          // Set role in localStorage
          setIsAdmin(false);
          localStorage.setItem("isAdmin", false);

          toast.success("Login Successful");
          navigate("/user-dashboard");
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Visitor sign up
        let newUrl = `${backendUrl}/api/visitors/signup`;
        const response = await axios.post(newUrl, data);

        if (response.data.success) {
          // Set role in localStorage
          setToken(response.data.token);
          localStorage.setItem("isAdmin", false);
          localStorage.setItem("token", response.data.token);

          toast.success("Register Successful");
          navigate("/user-dashboard");
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      // Error handling
      toast.error("Invalid Credentials");
      console.error("Error: ", error);

      // Reset form data if error occurs
      if (currState === "Login") {
        setData({
          email: "",
          password: "",
        });
      } else {
        setData({
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
      }
    }
  };

  return (
    <form onSubmit={handleVisitorLogin} className="space-y-4">
      <h2 className="font-bold text-center text-2xl">{currState} User</h2>
      {currState === "Login" ? (
        <></>
      ) : (
        <div>
          <label>Name</label>
          <input
            type="text"
            value={data.name}
            name="name"
            onChange={handleOnChange}
            className="border p-2 w-full"
            required
          />
        </div>
      )}

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleOnChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={data.password}
          name="password"
          onChange={handleOnChange}
          className="border p-2 w-full"
          required
        />
      </div>
      {currState === "Login" ? (
        <></>
      ) : (
        <div>
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={data.mobile}
            onChange={handleOnChange}
            className="border p-2 w-full"
            required
          />
        </div>
      )}
      {currState === "Login" ? (
        <p className="text-xs">
          Create a new account? {"  "}
          <span
            onClick={() => setCurrState("Sign Up")}
            className="cursor-pointer font-bold"
          >
            Click here
          </span>
        </p>
      ) : (
        <p className="text-xs">
          Already have an account? {"  "}
          <span
            onClick={() => setCurrState("Login")}
            className="cursor-pointer font-bold"
          >
            Login here
          </span>
        </p>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 w-[100%] rounded-md font-medium"
      >
        {currState} as User
      </button>
    </form>
  );
};

export default VisitorLogin;
