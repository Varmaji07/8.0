const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('../models/User');

// Password handler
const bcrypt = require('bcrypt');

// signup
router.post('/api/signup', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        name = (name || "").trim();
        email = (email || "").trim();
        password = (password || "").trim();

        if (!name || !email || !password) {
            return res.json({ status: "FAILED", message: "All fields are required" });
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.json({ status: "FAILED", message: "Invalid email format" });
        }
        if (name.length < 3) {
            return res.json({ status: "FAILED", message: "Name must be at least 3 characters long" });
        }
        if (password.length < 6) {
            return res.json({ status: "FAILED", message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: "FAILED", message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const result = await newUser.save();
        res.json({
            status: "SUCCESS",
            message: "Signup successful",
            data: {
                _id: result._id,
                name: result.name,
                email: result.email
            }
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.json({
            status: "FAILED",
            message: "An internal error occurred during signup. Details: " + err.message
        });
    }
});

// login
router.post('/api/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = (email || "").trim();
        password = (password || "").trim();

        if (!email || !password) {
            return res.json({ status: "FAILED", message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.json({ status: "FAILED", message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: "FAILED", message: "Invalid credentials" });
        }

        res.json({
            status: "SUCCESS",
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.json({
            status: "FAILED",
            message: "An internal error occurred during login. Details: " + err.message
        });
    }
});

module.exports = router;