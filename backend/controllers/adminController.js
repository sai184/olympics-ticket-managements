import jwt from "jsonwebtoken";
import Ticket from "../models/ticketModel.js";

// Admin Login (Hardcoded)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the provided email and password match the expected values
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a token payload
      const token = jwt.sign(
        { email: email, role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h", // Optional: set expiration for the token
        }
      );

      // Respond with success and the generated token
      return res.json({ success: true, token });
    } else {
      // Respond with failure if credentials are invalid
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Sold Ticket Report
export const generateSoldTicketsReport = async (req, res) => {
  try {
    // Fetch all sold and gifted tickets
    const tickets = await Ticket.find({
      $or: [
        { status: "active" }, // Sold tickets
        { status: "gifted" }, // Gifted tickets
      ],
    })
      .populate("eventId", "name price") // Populate event details
      .exec();

    // Initialize report data structure
    const report = {};

    // Calculate total revenue and tickets sold per event
    tickets.forEach((ticket) => {
      const eventName = ticket.eventId.name;
      // const ticketPrice = ticket.eventId.price;

      // If the event is not already in the report, initialize it
      if (!report[eventName]) {
        report[eventName] = {
          totalTicketsSold: 0,
          totalRevenue: 0,
          activeTickets: 0,
          giftedTickets: 0,
        };
      }

      // Update totals based on ticket status
      const ticketsCount = ticket.numberOfTickets; // Use numberOfTickets field
      report[eventName].totalTicketsSold += ticketsCount; // Increment total tickets sold
      report[eventName].totalRevenue += ticket.totalPrice; // Increment total revenue

      if (ticket.status === "active") {
        report[eventName].activeTickets += ticketsCount; // Count sold tickets
      } else if (ticket.status === "gifted") {
        report[eventName].giftedTickets += ticketsCount; // Count gifted tickets
      }
    });

    // Convert the report object into an array for easier response formatting
    const reportArray = Object.entries(report).map(([event, data]) => ({
      event,
      totalTicketsSold: data.totalTicketsSold,
      activeTickets: data.activeTickets,
      giftedTickets: data.giftedTickets,
      totalRevenue: data.totalRevenue,
    }));

    // Total revenue and total tickets sold across all events
    const totalRevenueOverall = reportArray.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const totalTicketsSoldOverall = reportArray.reduce(
      (sum, item) => sum + item.totalTicketsSold,
      0
    );

    // Response structure
    res.status(200).json({
      success: true,
      report: reportArray,
      totalRevenue: totalRevenueOverall,
      totalTicketsSold: totalTicketsSoldOverall,
    });
  } catch (error) {
    console.error("Error generating sold tickets report:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Booking History
export const getTicketBookingHistory = async (req, res) => {
  try {
    // Fetch all ticket bookings and populate relevant fields
    const tickets = await Ticket.find()
      .populate("visitorId", "name email mobile") // Populate visitor details
      .populate("eventId", "name date time venue price") // Populate event details
      .exec();

    // Format the ticket booking history for response
    const bookingHistory = tickets.map((ticket) => ({
      ticketId: ticket._id,
      visitor: {
        name: ticket.visitorId.name,
        email: ticket.visitorId.email,
        mobile: ticket.visitorId.mobile,
      },
      event: {
        name: ticket.eventId.name,
        date: ticket.eventId.date,
        time: ticket.eventId.time,
        venue: ticket.eventId.venue,
        price: ticket.eventId.price,
      },
      status: ticket.status,
      purchaseDate: ticket.purchaseDate,
      paymentStatus: ticket.paymentStatus,
      numberOfTickets: ticket.numberOfTickets,
    }));

    // Send response
    res.status(200).json({
      success: true,
      bookingHistory,
    });
  } catch (error) {
    console.error("Error fetching ticket booking history:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
