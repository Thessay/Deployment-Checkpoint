const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
const usersRoute = require("./routes/users");
app.use("/api/users", usersRoute);

// PRODUCTION LOGIC
if (process.env.NODE_ENV === "production") {
  // We use path.resolve to ensure we are looking inside the current directory
  // Azure puts your files in C:\home\site\wwwroot\
  const buildPath = path.resolve(__dirname, "frontend", "build");

  // Serve static files from the React build folder
  app.use(express.static(buildPath));

  // FIX: Changed "*" to "/*" to prevent the 'Missing parameter name' TypeError
  app.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
      if (err) {
        // This will show in your Log Stream if the 'build' folder is missing
        console.error("Error sending index.html:", err);
        res.status(500).send("Frontend build not found. Ensure 'npm run build' was executed.");
      }
    });
  });
}

// PORT logic: Azure Windows uses a named pipe (string), local uses 5000 (number)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
