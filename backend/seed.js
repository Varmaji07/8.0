require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dns = require('dns');

// Fix for DNS SRV resolution issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');

// Sample user credentials for seeding (all passwords are "password123")
const data = [
  { name: "Arjun Mehta", email: "arjun.mehta@example.com", password: "password123" },
  { name: "Sara Khan", email: "sara.khan@example.com", password: "password123" },
  { name: "Leo Das", email: "leo.das@example.com", password: "password123" },
  { name: "Priya Sharma", email: "priya.sharma@example.com", password: "password123" },
  { name: "Kevin Vora", email: "kevin.vora@example.com", password: "password123" },
  { name: "Ananya Iyer", email: "ananya.iyer@example.com", password: "password123" },
  { name: "Rohan Shah", email: "rohan.shah@example.com", password: "password123" },
  { name: "Meera Joshi", email: "meera.joshi@example.com", password: "password123" },
  { name: "Ishaan Malhotra", email: "ishaan.malhotra@example.com", password: "password123" },
  { name: "Zoya Williams", email: "zoya.williams@example.com", password: "password123" },
];

async function seedDB() {
  try {
    // Use the same Atlas URI from .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    // Clear the collection to prevent duplicates
    await User.deleteMany({});

    // Hash all passwords before inserting
    const saltRounds = 10;
    const usersWithHashedPasswords = await Promise.all(
      data.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return { name: user.name, email: user.email, password: hashedPassword };
      })
    );

    // Insert the documents
    await User.insertMany(usersWithHashedPasswords);

    console.log(`Successfully inserted ${usersWithHashedPasswords.length} User Credentials!`);
  } catch (err) {
    console.error("Seed Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();