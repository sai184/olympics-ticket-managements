import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const EventBrowse = () => {
  const { backendUrl, token } = useContext(StoreContext); // Assuming your context has backendUrl and token
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [ticketData, setTicketData] = useState({}); // To store tickets and payment method per event

  // Fetch events on component mount
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event`);
      if (response.data.success) {
        setEvents(response.data.events);
        setFilteredEvents(response.data.events); // Set initial filtered events
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
      <h1 className="text-3xl font-bold mb-4">Event Browse</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search events by name, venue, date, or time"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const { numberOfTickets = 1, paymentMethod = "offline" } =
              ticketData[event._id] || {};
            return (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-lg p-6 border"
              >
                <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Venue: {event.venue}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">Time: {event.time}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Total Tickets: {event.totalTickets}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Available Tickets: {event.availableTickets}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Price: ${event.price}
                </p>
                <p
                  className={`text-sm ${
                    event.status === "upcoming"
                      ? "text-green-500"
                      : "text-red-500"
                  } mb-2`}
                >
                  Status:{" "}
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </p>

                {/* Input to select number of tickets */}
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

                {/* Select Payment Method */}
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

                {/* Buy Now Button */}
                <button
                  onClick={() => PurchaseTicket(event._id)}
                  className={`${
                    event.availableTickets > 0
                      ? "bg-blue-500"
                      : "bg-gray-500 cursor-not-allowed"
                  } text-white py-2 px-4 w-full rounded-md mt-4`}
                  disabled={event.availableTickets === 0} // Disable if no tickets are available
                >
                  {event.availableTickets > 0 ? "Buy Now" : "Sold Out"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No events found matching the search query.</p>
        )}
      </div>
    </div>
  );
};

export default EventBrowse;
