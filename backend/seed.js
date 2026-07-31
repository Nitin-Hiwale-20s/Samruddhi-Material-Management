// Run with: npm run seed
// Creates the first admin user using ADMIN_* values from .env (if not already present).
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
    const exists = await User.findOne({ email });

    if (exists) {
      console.log(`Admin user already exists: ${email}`);
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email,
        password: process.env.ADMIN_PASSWORD || "Admin@123",
        role: "admin",
      });
      console.log(`Admin user created: ${email} / password from .env (ADMIN_PASSWORD)`);
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
