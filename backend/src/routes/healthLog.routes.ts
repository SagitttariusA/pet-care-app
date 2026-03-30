import { Router } from "express";
import {
  createHealthLog,
  deleteHealthLog,
  getHealthLogById,
  getHealthLogs,
  getHealthLogsByPetId,
  updateHealthLog,
} from "../controllers/healthLog.controller.js";

const router = Router();

router.get("/", getHealthLogs);
router.get("/pet/:petId", getHealthLogsByPetId);
router.get("/:id", getHealthLogById);
router.post("/", createHealthLog);
router.put("/:id", updateHealthLog);
router.delete("/:id", deleteHealthLog);

export default router;