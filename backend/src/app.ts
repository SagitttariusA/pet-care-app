import express from "express";
import cors from "cors";
import petRoutes from "./routes/pet.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.use("/pets", petRoutes);

export default app;