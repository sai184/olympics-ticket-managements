import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const EventPage = () => {
  const { backendUrl, token } = useContext(StoreContext);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const images = [
    assets.adminEvent1,
    assets.adminEvent2,
    assets.adminEvent3,
    assets.adminEvent4,
    assets.adminEvent5,
  ];

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event/`);
      if (response.data.events) {
        setEvents(response.data.events);
      } else {
        console.error("No events found.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRemoveTickets = async (eventId) => {
    const ticketsToRemove = prompt(
      "Enter the number of tickets to remove (only numbers):"
    );

    // Validate input for numbers only
    if (ticketsToRemove && /^\d+$/.test(ticketsToRemove)) {
      console.log("Token:", token); // Logging token to check if it's available

      try {
        const response = await axios({
          method: "delete",
          url: `${backendUrl}/api/event/tickets/${eventId}/remove`,
          headers: {
            token: token, // Pass the token as a header
          },
          data: {
            ticketsToRemove: ticketsToRemove, // Pass the ticketsToRemove in the request body
          },
        });

        if (response.data.success) {
          toast.success("Tickets removed successfully!");
          fetchEvents(); // Re-fetch events to update the list with updated tickets
        }
      } catch (error) {
        console.error("Error removing tickets:", error);
        alert("Failed to remove tickets. Please try again.");
      }
    } else {
      alert("Please enter a valid number.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Games</h1>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="shadow-lg rounded-lg border overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative">
                {/* Labels on Top */}
                <div className="absolute top-2 left-2 z-10">
                  <p className="text-xs bg-white px-2 py-1 font-bold inline rounded shadow-sm">
                    {new Date(event.date)
                      .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })
                      .toUpperCase()}
                  </p>
                </div>
                <div className="absolute top-2 right-0 z-10">
                  <p
                    className={`font-medium text-xs bg-yellow-300 rounded-l-[4px]  text-center px-2 py-1 ${
                      event.status === "upcoming"
                        ? "text-blue-500"
                        : event.status === "completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)}
                  </p>
                </div>

                {/* Adjusted Image */}
                <img
                  src={images[Math.floor(Math.random() * images.length)]}
                  alt="Event Banner"
                  className="w-full h-48 object-cover transform -translate-y-2"
                />
              </div>

              {/* Card Content */}
              <div className="px-4 pb-4">
                <h2 className="text-lg font-bold mb-2">{event.name}</h2>
                <div className="flex gap-2 items-center text-xs text-gray-800 pb-1">
                  <img src={assets.time} alt="Time Icon" className="w-6" />
                  {(() => {
                    const time = event.time;
                    if (!time) return "N/A";

                    let [hours, minutes] = time.split(":").map(Number);
                    const period = hours >= 12 ? "PM" : "AM";
                    hours = hours % 12 || 12;

                    return `${new Date(event.date)
                      .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })
                      .toUpperCase()} | ${hours}:${minutes
                      .toString()
                      .padStart(2, "0")} ${period}`;
                  })()}
                </div>

                <div className="flex gap-2 items-center text-xs text-gray-800 pb-1">
                  <img src={assets.location} alt="" className="w-6" />
                  {event.venue}
                </div>
                <div className="flex gap-2 items-center text-xs text-gray-800 pb-1">
                  <img src={assets.ticketIcon} alt="" className="w-6" />
                  {event.availableTickets}
                </div>
                <p className="text-xs text-gray-800 mb-1 flex gap-2 items-center pb-1">
                  <img src={assets.money} alt="" className="w-6" />
                  {event.price} USD
                </p>
                <div
                  onClick={() => handleRemoveTickets(event._id)}
                  className="mt-2 bg-red-400 text-white py-1 cursor-pointer px-3 rounded hover:bg-red-500 flex items-center justify-center"
                >
                  <p className="px-3 text-xs font-medium text-black">
                    {" "}
                    Remove Tickets
                  </p>
                  <img src={assets.cacelTicket} className="w-6"></img>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventPage;
