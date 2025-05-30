import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';

const messsageRouter = express.Router();

messsageRouter.get("/users", protectRoute, getUsersForSidebar);
messsageRouter.get("/:id", protectRoute, getMessages);
messsageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messsageRouter.post("/send/:id", protectRoute, sendMessage)

export default messsageRouter;