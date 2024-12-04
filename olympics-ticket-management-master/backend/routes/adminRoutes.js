import express from "express";
import { adminProtect } from "../middlewares/authMiddleware.js";
import {
  generateSoldTicketsReport,
  getTicketBookingHistory,
} from "../controllers/adminController.js";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();
router.post("/login", adminLogin);
router.get("/reports/sold-tickets", adminProtect, generateSoldTicketsReport);
router.get("/tickets/history", adminProtect, getTicketBookingHistory);

export default router;
