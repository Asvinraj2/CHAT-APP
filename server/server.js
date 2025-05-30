import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDb } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messsageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io'; 

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }  // FIX 5: Changed from "+" to "*"
});

// Store online users
export const userSocketmap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) userSocketmap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    // socket.on("disconnect", () => {  // FIX 6: Changed from "Disconnect" to "disconnect"
    //     console.log("User disconnected:", userId);
    //     delete userSocketmap[userId];
    //     io.emit("getOnlineUsers", Object.keys(userSocketmap));
    // });

    // server.js
    socket.on("disconnect", () => {
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
});

});

// Middleware setup 
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messsageRouter);

// Connect to MongoDB 
await connectDb();     

const PORT = process.env.PORT || 5000;   
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));