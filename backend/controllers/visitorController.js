import Visitor from "../models/visitorModel.js";
import Ticket from "../models/ticketModel.js";
import Event from "../models/eventModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Visitor Signup
export const signupVisitor = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if visitor already exists
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
      return res
        .status(400)
        .json({ success: false, message: "Visitor already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new visitor
    const visitor = new Visitor({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    // Save visitor to the database
    await visitor.save();

    // Create token
    const token = jwt.sign({ id: visitor._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Visitor Login
export const loginVisitor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if visitor exists
    const visitor = await Visitor.findOne({ email });
    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, visitor.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: visitor._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get Profile Info
export const getVisitorProfile = async (req, res) => {
  try {
    const visitorId = req.user?.id;

    // Check if req.user or visitorId exists
    if (!visitorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No visitor found",
      });
    }

    // Fetch the visitor's profile from the database using the ID
    const visitor = await Visitor.findById(visitorId); // Assuming 'Visitor' is your model

    // Check if the visitor exists
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    // Respond with the visitor's profile details
    return res.status(200).json({
      success: true,
      message: "Visitor profile fetched successfully",
      visitor, // Return the visitor data
    });
  } catch (error) {
    console.error("Error fetching visitor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Personal Info
export const updateVisitorDetails = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Find the visitor using the ID attached to req.user by the middleware
    const visitor = await Visitor.findById(req.user._id);

    if (!visitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    // Check if email is being updated and if it's unique
    if (email && email !== visitor.email) {
      const existingVisitor = await Visitor.findOne({ email });

      if (existingVisitor) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already in use." });
      }
      visitor.email = email; // Update email
    }

    // Update other visitor details
    if (name) visitor.name = name;
    if (mobile) visitor.mobile = mobile;

    // If a new password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      visitor.password = await bcrypt.hash(password, salt); // Hash the new password
    }

    // Save updated visitor details
    const updatedVisitor = await visitor.save();

    // Optionally, create a new token if email/password has changed
    const token = jwt.sign({ id: updatedVisitor._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      success: true,
      message: "Visitor details updated successfully",
      visitor: updatedVisitor,
      token, // Send the new token back
    });
  } catch (error) {
    console.error("Error updating visitor details:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Ticket Purchase
export const purchaseTickets = async (req, res) => {
  const { eventId, numberOfTickets, paymentMethod } = req.body;

  // Validate input
  if (!eventId || !numberOfTickets || !paymentMethod) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }
  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    // Check if there are enough available tickets
    if (event.availableTickets < numberOfTickets) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough available tickets." });
    }

    // Calculate the total price for the tickets
    const totalPrice = event.price * numberOfTickets;

    // Create the ticket
    const ticket = new Ticket({
      eventId,
      visitorId: req.user._id, // Get the user ID from the middleware
      status: "active",
      paymentStatus: "completed", // Initial payment status
      paymentMethod,
      purchaseDate: new Date(),
      numberOfTickets,
      totalPrice,
    });

    // Save the ticket
    await ticket.save();

    // Update available tickets
    event.availableTickets -= numberOfTickets;
    await event.save();

    return res.status(201).json({
      success: true,
      message: "Tickets purchased successfully.",
      ticket,
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Cancel Ticket
export const cancelTicket = async (req, res) => {
  const { ticketId } = req.body; // Ticket ID to cancel

  try {
    // Find the ticket by ID and ensure it belongs to the authenticated visitor
    const ticket = await Ticket.findOne({
      _id: ticketId,
      visitorId: req.user._id,
    });

    console.log("Ticket Details", ticket);

    // Check if the ticket exists
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or does not belong to the user.",
      });
    }

    // Find the event related to the ticket
    const event = await Event.findById(ticket.eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Update the event's available tickets based on the number of tickets purchased
    event.availableTickets += ticket.numberOfTickets; // Assuming numberOfTickets is a field in the Ticket schema
    await event.save(); // Save the updated event

    ticket.status = "canceled"; // Update the status to canceled
    await ticket.save(); // Save the updated ticket

    // Send success response
    res.status(200).json({
      success: true,
      message: "Ticket canceled successfully.",
    });
  } catch (error) {
    console.error("Error canceling ticket:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Purchase History
export const viewTicketPurchaseHistory = async (req, res) => {
  try {
    // Find tickets for the authenticated visitor
    const tickets = await Ticket.find({ visitorId: req.user._id }).populate(
      "eventId",
      "name date time venue price status"
    );

    // Check if tickets exist
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tickets found for this visitor.",
      });
    }

    // Send back the ticket purchase history
    res.status(200).json({
      success: true,
      tickets: tickets,
    });
  } catch (error) {
    console.error("Error fetching ticket purchase history:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Ticket PDF
export const getTicketDetails = async (req, res) => {
  const ticketId = req.params.id;

  try {
    // Find the ticket by ID and populate event details
    const ticket = await Ticket.findById(ticketId).populate("eventId");

    console.log("Ticket getTicketDetails", ticket);

    // Check if ticket exists
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Send back the ticket details
    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Gift Ticket ----> ISSUE
export const giftTicket = async (req, res) => {
  const ticketId = req.params.id;
  const { recipientEmail } = req.body;

  try {
    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    console.log("Ticket Info", ticket);

    // Check if ticket exists
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // // Check if the ticket has already been gifted
    // if (ticket.status === "gifted") {
    //   console.log(ticket.status);
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "This ticket has already been gifted and cannot be gifted again.",
    //   });
    // }
    // Check if the authenticated user is the ticket owner
    if (!ticket.visitorId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to gift this ticket",
      });
    }

    // Find the recipient visitor by email
    const recipient = await Visitor.findOne({ email: recipientEmail });

    // Check if recipient exists
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "Recipient not found" });
    }

    // Update the ticket's visitorId to the recipient's ID
    ticket.visitorId = recipient._id;
    ticket.status = "gifted"; // Optionally change the status to indicate it's been gifted

    // Save the updated ticket to the database
    await ticket.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Ticket gifted successfully",
      ticket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
