require('dotenv').config();
const mongoose = require("mongoose");
const dns = require('dns');

// Force Node.js to use public DNS servers to resolve MongoDB SRV records
// This fixes the 'querySrv ECONNREFUSED' error on some networks.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Add this temporary line to /config/db.js
const maskedURI = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'UNDEFINED';
console.log("Connecting to URI:", maskedURI);

mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
});