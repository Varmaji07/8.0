require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log("Checking MongoDB Connection...");
console.log("URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ SUCCESS: MongoDB connected successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ ERROR: Could not connect to MongoDB.");
        console.error("Reason:", err.message);
        console.log("\n--- TROUBLESHOOTING ---");
        console.log("1. Go to MongoDB Atlas -> Network Access.");
        console.log("2. Ensure your IP address is whitelisted.");
        console.log("3. If you're on a restricted network, try a mobile hotspot.");
        process.exit(1);
    });
