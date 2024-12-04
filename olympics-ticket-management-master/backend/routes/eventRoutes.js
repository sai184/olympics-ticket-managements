import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddleware.js";
import {
  createEvent,
  addNewTickets,
  updateTicketPrice,
  removeTickets,
  browseEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create", adminProtect, createEvent);
router.post("/tickets/:eventId", adminProtect, addNewTickets);
router.put("/:eventId/update-price", adminProtect, updateTicketPrice);
router.delete("/tickets/:eventId/remove", adminProtect, removeTickets);
router.get("/", browseEvents);

export default router;
