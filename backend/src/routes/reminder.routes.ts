import { Router } from "express";
import {
  createReminder,
  deleteReminder,
  getReminderById,
  getReminders,
  getRemindersByPetId,
  updateReminder,
} from "../controllers/reminder.controller.js";

const router = Router();

router.get("/", getReminders);
router.get("/pet/:petId", getRemindersByPetId);
router.get("/:id", getReminderById);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;