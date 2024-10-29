import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const BookingHistory = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/tickets/history`,
          {
            headers: { token: token },
          }
        );

        if (response.data.success) {
          setBookingHistory(response.data.bookingHistory);
        } else {
          toast.error("Failed to fetch booking history.");
        }
      } catch (error) {
        console.error("Error fetching booking history:", error);
        toast.error("An error occurred while fetching booking history.");
      }
    };

    if (token) {
      fetchBookingHistory();
    }
  }, [backendUrl, token]);

  // Filter booking history based on search query
  const filteredBookingHistory = bookingHistory.filter(
    (booking) =>
      booking.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.visitor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by event name, visitor name, or email..."
          className="border rounded p-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBookingHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookingHistory.map((booking) => (
            <div
              key={booking.ticketId}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-lg font-bold mb-2">{booking.event.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Date: {new Date(booking.event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Time: {booking.event.time}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Venue: {booking.event.venue}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Visitor: {booking.visitor.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Email: {booking.visitor.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Status:{" "}
                <span
                  className={`font-bold ${
                    booking.status === "gifted"
                      ? "text-green-500"
                      : booking.status === "canceled"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Number of Tickets: {booking.numberOfTickets}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Purchase Date:{" "}
                {new Date(booking.purchaseDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Payment Status:{" "}
                {booking.paymentStatus.charAt(0).toUpperCase() +
                  booking.paymentStatus.slice(1)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No booking history found.</p>
      )}
    </div>
  );
};

export default BookingHistory;
