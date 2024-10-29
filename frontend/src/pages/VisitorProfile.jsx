import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const VisitorProfile = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [visitor, setVisitor] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Fetch visitor profile on page load
  useEffect(() => {
    console.log(token);

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/visitors/profile`, {
          headers: {
            token: token,
          },
        });
        setVisitor(response.data.visitor);
        setFormData(response.data.visitor);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [backendUrl, token]);

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/visitors/profile`,
        { ...formData },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        setVisitor(response.data.visitor); // Update visitor state
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Visitor Profile</h2>

      <div className="flex flex-col space-y-4">
        {/* Name */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`border p-2 w-2/3 ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`border p-2 w-2/3 ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={!isEditing}
            className={`border p-2 w-2/3 ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        {!isEditing ? (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md"
              onClick={handleUpdate}
            >
              Update Profile
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md"
              onClick={() => {
                setIsEditing(false);
                setFormData(visitor); // Reset form to original data
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitorProfile;
