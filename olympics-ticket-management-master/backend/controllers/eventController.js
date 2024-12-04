import Event from "../models/eventModel.js";
import { parse } from "date-fns";

// Create Event
export const createEvent = async (req, res) => {
  const { name, date, time, venue, totalTickets, price } = req.body;

  // Validate required fields
  if (!name || !date || !time || !venue || !totalTickets || !price) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields." });
  }

  try {
    // Parse the date using date-fns
    const eventDate = parse(date, "dd-MM-yyyy", new Date());
    // Create a new event instance
    const event = new Event({
      name,
      date: eventDate,
      time,
      venue,
      totalTickets,
      availableTickets: totalTickets, // Initially, available tickets = total tickets
      price,
    });

    // Save the event to the database
    const savedEvent = await event.save();

    // Send back the created event details
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add New Ticket
export const addNewTickets = async (req, res) => {
  const { newTickets } = req.body; // Number of new tickets to add

  // Validate the number of new tickets
  if (!newTickets || newTickets <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid number of tickets to add.",
    });
  }

  try {
    // Find the event by ID
    const event = await Event.findById(req.params.eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Update the total and available tickets
    event.totalTickets += newTickets;
    event.availableTickets += newTickets;

    // Save the updated event to the database
    const updatedEvent = await event.save();

    // Send back the updated event details
    res.status(200).json({
      success: true,
      message: "New tickets added successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error adding tickets:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Ticket Price
export const updateTicketPrice = async (req, res) => {
  const { price } = req.body; // New price from request body

  // Validate price
  if (!price || price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ticket price.",
    });
  }

  try {
    // Find the event by ID from the URL params
    const event = await Event.findById(req.params.eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Update the ticket price
    event.price = price;

    // Save the updated event
    const updatedEvent = await event.save();

    // Return the updated event details
    return res.status(200).json({
      success: true,
      message: "Ticket price updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating ticket price:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error. Unable to update ticket price.",
    });
  }
};

// Remove tickets for a specific event
export const removeTickets = async (req, res) => {
  const { ticketsToRemove } = req.body; // Number of tickets to remove from request body

  // Validate the number of tickets to remove
  if (!ticketsToRemove || ticketsToRemove <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid number of tickets to remove.",
    });
  }

  try {
    // Find the event by ID from the URL params
    const event = await Event.findById(req.params.eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Ensure that tickets to remove does not exceed available or total tickets
    if (ticketsToRemove > event.availableTickets) {
      return res.status(400).json({
        success: false,
        message: `Cannot remove more tickets than available. Only ${event.availableTickets} available tickets.`,
      });
    }

    // Update the total and available tickets
    event.totalTickets -= ticketsToRemove;
    event.availableTickets -= ticketsToRemove;

    // Save the updated event to the database
    const updatedEvent = await event.save();

    // Send back the updated event details
    return res.status(200).json({
      success: true,
      message: "Tickets removed successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error removing tickets:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error. Unable to remove tickets.",
    });
  }
};

// Browse Events
export const browseEvents = async (req, res) => {
  try {
    // Find all upcoming events with available tickets
    const events = await Event.find({
      // availableTickets: { $gt: 0 }, // Tickets greater than 0
      // status: "upcoming", // Event should be upcoming
    });

    // If no events found, return an appropriate message
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No upcoming events with available tickets found.",
      });
    }

    // Return the list of available events
    return res.status(200).json({
      success: true,
      message: "Available events fetched successfully.",
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);

    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Server Error. Unable to fetch events.",
    });
  }
};
