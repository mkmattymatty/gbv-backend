require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const passport = require("./config/passport");

const authRoutes = require("./routes/auth");
const safetyPlanRoutes = require("./routes/safetyPlan");
const resourceRoutes = require("./routes/resources");
const messageRoutes = require("./routes/messages");
const commentRoutes = require("./routes/comments");
const connectDB = require("./config/db");
const Message = require("./models/Message");

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/safety-plans", safetyPlanRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Load chat history for new clients
  Message.find()
    .sort({ createdAt: 1 })
    .then((messages) => {
      socket.emit("chatHistory", messages);
    });

  // Listen for new chat messages
  socket.on("sendMessage", async (msg) => {
    try {
      const newMsg = new Message(msg);
      await newMsg.save();
      io.emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  // Typing notifications
  socket.on("typing", ({ user }) => {
    socket.broadcast.emit("typing", { user });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
