
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const setupSwagger = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
require("./utils/cronJob"); // this starts the cron when the server starts
 // Fetch and post news immediately on server start

const journalRoutes = require("./routes/journal");
const newsRoutes = require("./routes/news");
const authRouter = require("./routes/authRoute");
const analyzeRoutes = require("./routes/analyze");
const contactRoutes =require("./routes/Contact")


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {console.log("✅ MongoDB connected")

  }
)
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is alive");
});

// API routes

app.use('/api/journal', journalRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/auth', authRouter);
app.use('/api/contact',contactRoutes)


// Error handler
app.use(errorHandler);
setupSwagger(app);
//404 error handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message:"Internal Error"});
});
// Start server (only once)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
