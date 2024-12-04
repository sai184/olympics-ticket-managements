/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddEventDialog = ({ isOpen, onClose, backendUrl, token }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      name,
      date,
      time,
      venue,
      totalTickets,
      price,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/event/create`,
        eventData,
        {
          headers: { token: token },
        }
      );

      if (response.data.success) {
        toast.success("Event added successfully");
        onClose(); // Close modal on success
      } else {
        toast.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("An error occurred while adding the event");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[60%]">
        <h2 className="text-xl font-semibold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-5">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Event Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="20-08-2024"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="18:00"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Total Tickets
            </label>
            <input
              type="number"
              value={totalTickets}
              onChange={(e) => setTotalTickets(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddEventDialog;
