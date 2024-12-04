import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  signupVisitor,
  loginVisitor,
  getVisitorProfile,
  updateVisitorDetails,
  purchaseTickets,
  cancelTicket,
  viewTicketPurchaseHistory,
  getTicketDetails,
  giftTicket,
} from "../controllers/visitorController.js";

const router = express.Router();

// Visitor
router.post("/signup", signupVisitor);
router.post("/login", loginVisitor);
router.get("/profile", protect, getVisitorProfile);
router.put("/profile", protect, updateVisitorDetails);
router.post("/tickets/order", protect, purchaseTickets);
router.delete("/tickets/cancel", protect, cancelTicket);
router.get("/purchase-history", protect, viewTicketPurchaseHistory);
router.get("/ticket/:id", protect, getTicketDetails);
router.post("/ticket/:id/gift", protect, giftTicket);

export default router;
