import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const BookingHistory = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // New state for status filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Filter booking history based on search query and status filter
  const filteredBookingHistory = bookingHistory.filter((booking) => {
    const matchesSearch =
      booking.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.visitor.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookingHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredBookingHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>

      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by games, visitor name, or email..."
          className="border p-2 w-full md:w-1/2 lg:w-[30%] text-[12px] rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status Dropdown */}
        <select
          className="border p-2 rounded-lg text-[12px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Gifted">Gifted</option>
          <option value="Canceled">Canceled</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {currentItems.length > 0 ? (
        <>
          {/* Booking History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((booking) => (
              <div
                key={booking.ticketId}
                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-md font-semibold text-gray-800 mb-2 truncate">
                  {booking.event.name}
                </h2>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  {new Date(booking.event.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Time:</span>{" "}
                  {booking.event.time}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Venue:</span>{" "}
                  {booking.event.venue}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Visitor:</span>{" "}
                  {booking.visitor.name}
                </p>
                <p className="text-xs text-gray-500 mb-1 truncate">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {booking.visitor.email}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  <span
                    className={`font-medium ${
                      booking.status === "gifted"
                        ? "text-green-600"
                        : booking.status === "canceled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Tickets:</span>{" "}
                  {booking.numberOfTickets}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">
                    Purchase Date:
                  </span>{" "}
                  {new Date(booking.purchaseDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">
                    Payment Status:
                  </span>{" "}
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-9 flex flex-col justify-center items-center space-x-2">
            <p className="text-center pb-5">Pagination </p>
            <div>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 mx-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-[#0f172a] text-white"
                      : "bg-white text-[#0f172a]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>No booking history found.</p>
      )}
    </div>
  );
};

export default BookingHistory;
