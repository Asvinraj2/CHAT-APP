import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        //  Correct way to get token from headers
        const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
        
        if (!token) {
            return res.json({ success: false, message: "jwt must be provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}