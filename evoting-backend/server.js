import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import electionRoutes from "./src/routes/electionRoutes.js";
import voteRoutes from "./src/routes/voteRoutes.js";
import resultRoutes from "./src/routes/resultRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// ✅ Allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Morgan — logs all API hits
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/results", resultRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ msg: "College Election API is running 🚀" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
