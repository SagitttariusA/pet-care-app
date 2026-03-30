import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import petRoutes from "./routes/pet.routes.js";
import healthLogRoutes from "./routes/healthLog.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/health-logs", healthLogRoutes);
app.use("/api/reminders", reminderRoutes);

export default app;