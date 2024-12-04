import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const EventBrowse = () => {
  const { backendUrl, token } = useContext(StoreContext); // Assuming your context has backendUrl and token
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [ticketData, setTicketData] = useState({}); // To store tickets and payment method per event

  const images = [
    assets.adminEvent1,
    assets.adminEvent2,
    assets.adminEvent3,
    assets.adminEvent4,
    assets.adminEvent5,
  ];

  // Fetch events on component mount
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event`);
      if (response.data.success) {
        const eventsWithImages = response.data.events.map((event) => ({
          ...event,
          image: images[Math.floor(Math.random() * images.length)], // Assign a random image
        }));
        setEvents(eventsWithImages);
        setFilteredEvents(eventsWithImages); // Set initial filtered events
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [backendUrl]);

  // Filter events based on search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.venue.toLowerCase().includes(lowerCaseQuery) ||
        new Date(event.date).toLocaleDateString().includes(lowerCaseQuery) ||
        event.time.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  // Handle the change of number of tickets and payment method
  const handleInputChange = (eventId, field, value) => {
    setTicketData((prevData) => ({
      ...prevData,
      [eventId]: {
        ...prevData[eventId],
        [field]: value,
      },
    }));
  };

  // Purchase ticket function
  const PurchaseTicket = async (eventId) => {
    const { numberOfTickets = 1, paymentMethod = "offline" } =
      ticketData[eventId] || {};

    if (numberOfTickets < 1) {
      alert("Please select at least one ticket.");
      return;
    }

    const requestBody = {
      eventId,
      numberOfTickets,
      paymentMethod,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/visitors/tickets/order`,
        requestBody,
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success("Ticket purchased successfully!");
        fetchEvents();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during ticket purchase:", error);
      alert("Error during ticket purchase.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-[16px] font-bold mb-4">Browse Games</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search games by name, venue, date, or time"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 text-[12px] rounded-[10px] mb-4 w-[30%]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const { numberOfTickets = 1, paymentMethod = "offline" } =
              ticketData[event._id] || {};
            return (
              <div
                key={event._id}
                className="shadow-lg rounded-lg border overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative">
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
                      className={`font-medium text-xs bg-yellow-300 rounded-l-[4px] text-center px-2 py-1 ${
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
                  <img
                    src={event.image}
                    alt="Event Banner"
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Card Content */}
                {/* <div className="px-4 pb-4">
                  <h2 className="text-lg font-bold mb-2">{event.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Venue: {event.venue}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Time: {event.time}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Available Tickets: {event.availableTickets}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Price: ${event.price}
                  </p>
                  <input
                    type="number"
                    value={numberOfTickets}
                    onChange={(e) =>
                      handleInputChange(
                        event._id,
                        "numberOfTickets",
                        e.target.value
                      )
                    }
                    min="1"
                    max={event.availableTickets}
                    className="border p-2 mb-4 w-full"
                    placeholder="Number of tickets"
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      handleInputChange(
                        event._id,
                        "paymentMethod",
                        e.target.value
                      )
                    }
                    className="border p-2 mb-4 w-full"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                  <button
                    onClick={() => PurchaseTicket(event._id)}
                    className={`${
                      event.availableTickets > 0
                        ? "bg-blue-500"
                        : "bg-gray-500 cursor-not-allowed"
                    } text-white py-2 px-4 w-full rounded-md mt-4`}
                    disabled={event.availableTickets === 0}
                  >
                    {event.availableTickets > 0 ? "Buy Now" : "Sold Out"}
                  </button>
                </div> */}
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2">{event.name}</h2>
                  <div className="text-sm text-gray-600 mb-1">
                    <img
                      src={assets.location}
                      alt="Location Icon"
                      className="inline-block w-4 mr-2"
                    />
                    {event.venue}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <img
                      src={assets.time}
                      alt="Time Icon"
                      className="inline-block w-4 mr-2"
                    />
                    {event.time}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <img
                      src={assets.ticketIcon}
                      alt="Tickets Icon"
                      className="inline-block w-4 mr-2"
                    />
                    {event.availableTickets}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <img
                      src={assets.money}
                      alt="Price Icon"
                      className="inline-block w-4 mr-2"
                    />
                    ${event.price}
                  </div>

                  <div className="flex gap-5">
                    <input
                      type="number"
                      value={numberOfTickets}
                      onChange={(e) =>
                        handleInputChange(
                          event._id,
                          "numberOfTickets",
                          e.target.value
                        )
                      }
                      min="1"
                      max={event.availableTickets}
                      className="border p-2 mb-4 w-full"
                      placeholder="Number of tickets"
                    />

                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        handleInputChange(
                          event._id,
                          "paymentMethod",
                          e.target.value
                        )
                      }
                      className="border p-2 mb-4 w-full"
                    >
                      <option value="offline">Offline</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  <button
                    onClick={() => PurchaseTicket(event._id)}
                    className={`text-white py-2 px-4 w-full rounded ${
                      event.availableTickets > 0
                        ? "bg-[#0f172a] hover:bg-[#213461]"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={event.availableTickets === 0}
                  >
                    {event.availableTickets > 0 ? "Buy Now" : "Sold Out"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No events found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default EventBrowse;
