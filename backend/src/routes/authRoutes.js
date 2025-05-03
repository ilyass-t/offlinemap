import express from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
}

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short" });
        }

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existName = await User.findOne({ username });
        if (existName) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const user = new User({
            email,
            username,
            password,
        });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    res.send("Login route");
});

export default router;
