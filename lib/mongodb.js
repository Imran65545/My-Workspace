import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI not defined in .env");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Script: Update all users to have a default image if missing
export async function addDefaultImagesToUsers() {
  await connectDB();
  const User = mongoose.models.User || mongoose.model("User");
  const users = await User.find({ $or: [ { image: { $exists: false } }, { image: null }, { image: "" } ] });
  for (const user of users) {
    user.image = `https://i.pravatar.cc/150?u=${user.email}`;
    await user.save();
    console.log(`Updated user ${user.email} with default image.`);
  }
  console.log("All users updated with default images if missing.");
}
