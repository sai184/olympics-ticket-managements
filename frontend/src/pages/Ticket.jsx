import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import for table support

const Ticket = () => {
  const { backendUrl, token } = useContext(StoreContext); // Context values
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/visitors/purchase-history`,
          { headers: { token: token } }
        );

        if (response.data.success) {
          setTickets(response.data.tickets); // Update state with tickets data
        } else {
          alert("No tickets found for this visitor.");
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    if (token) {
      fetchPurchaseHistory();
    }
  }, [backendUrl, token]);

  const handleCancelTicket = async (ticketId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel the ticket?"
    );

    if (confirmCancel) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/visitors/tickets/cancel`,
          {
            headers: { token: token },
            data: { ticketId },
          }
        );

        if (response.data.success) {
          toast.success("Ticket canceled successfully.");
          setTickets(
            tickets.map((ticket) =>
              ticket._id === ticketId
                ? { ...ticket, status: "canceled" }
                : ticket
            )
          );
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error canceling ticket:", error);
        alert("Failed to cancel ticket. Please try again.");
      }
    }
  };
  const downloadPDF = async (ticketId) => {
    try {
      // Fetch ticket details from the API
      const response = await axios.get(
        `${backendUrl}/api/visitors/ticket/${ticketId}`,
        {
          headers: { token: token },
        }
      );

      if (response.data.success) {
        const ticket = response.data.ticket;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text("Ticket Details", 14, 20);

        // Ticket ID
        doc.setFontSize(12);
        doc.text(`Ticket ID: ${ticket._id}`, 14, 30);

        // Add a horizontal line
        doc.setLineWidth(1);
        doc.line(14, 35, 196, 35); // Line from (x1, y1) to (x2, y2)

        // Table for Event Details
        doc.autoTable({
          head: [["Event Name", "Date", "Time", "Venue"]],
          body: [
            [
              ticket.eventId.name,
              new Date(ticket.eventId.date).toLocaleDateString(),
              ticket.eventId.time,
              ticket.eventId.venue,
            ],
          ],
          startY: 40,
          styles: { fontSize: 12 },
        });

        // Add Ticket Details Section
        doc.text("Ticket Information", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
          head: [
            [
              "Number of Tickets",
              "Payment Method",
              "Total Price",
              "Purchase Date",
            ],
          ],
          body: [
            [
              ticket.numberOfTickets,
              ticket.paymentMethod.charAt(0).toUpperCase() +
                ticket.paymentMethod.slice(1),
              `$${ticket.totalPrice}`,
              new Date(ticket.purchaseDate).toLocaleDateString(),
            ],
          ],
          startY: doc.lastAutoTable.finalY + 15,
          styles: { fontSize: 12 },
        });

        // Add some styling (e.g., footer)
        doc.setFontSize(10);
        doc.text(
          "Thank you for your purchase!",
          14,
          doc.lastAutoTable.finalY + 30
        );

        // Save the PDF
        doc.save(`ticket_${ticket._id}.pdf`);
      } else {
        alert(response.data.message || "Failed to fetch ticket details.");
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      alert("Failed to fetch ticket details. Please try again.");
    }
  };

  const handleGiftTicket = async (ticketId) => {
    const recipientEmail = prompt("Enter Recipient Email:");

    if (recipientEmail) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/visitors/ticket/${ticketId}/gift`,
          { recipientEmail },
          { headers: { token: token } }
        );

        if (response.data.success) {
          toast.success("Ticket gifted successfully.");
          setTickets(
            tickets.map((ticket) =>
              ticket._id === ticketId ? { ...ticket, status: "gifted" } : ticket
            )
          );
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error gifting ticket:", error);
        alert("Failed to gift ticket. Please try again.");
      }
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>

      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden border"
            >
              {/* Event Info */}
              <div className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-2">
                  {ticket.eventId.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Date: {new Date(ticket.eventId.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Time: {ticket.eventId.time}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Venue: {ticket.eventId.venue}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      ticket.status === "gifted"
                        ? "text-green-500"
                        : ticket.status === "canceled"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {ticket.status.charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </span>
                </p>
              </div>

              {/* Ticket Details */}
              <div className="p-4 bg-gray-100 w-full md:w-1/3">
                <p className="text-sm text-gray-600 mb-1">
                  Number of Tickets: {ticket.numberOfTickets}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Payment Method:{" "}
                  {ticket.paymentMethod.charAt(0).toUpperCase() +
                    ticket.paymentMethod.slice(1)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Total Price: ${ticket.totalPrice}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Purchase Date:{" "}
                  {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
              </div>

              {/* Buttons */}
              {ticket.status !== "canceled" && ticket.status !== "gifted" && (
                <div className="p-4 flex items-center flex-col gap-2">
                  <button
                    onClick={() => handleCancelTicket(ticket._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200 mr-2 text-xs"
                  >
                    Cancel Ticket
                  </button>
                  <button
                    onClick={() => downloadPDF(ticket._id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-200 text-xs"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleGiftTicket(ticket._id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-200 text-xs"
                  >
                    Gift Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
};

export default Ticket;
