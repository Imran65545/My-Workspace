import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI not defined in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Script: Update all users to have a default image if missing
export async function addDefaultImagesToUsers() {
  await connectDB();
  const User = mongoose.models.User || mongoose.model('User');

  const usersToUpdate = await User.find({
    $or: [{ image: { $exists: false } }, { image: null }, { image: '' }]
  })
    .select('_id email')
    .lean();

  if (usersToUpdate.length === 0) {
    console.log('All users already have images.');
    return;
  }

  const bulkOps = usersToUpdate.map(user => ({
    updateOne: {
      filter: { _id: user._id },
      update: { $set: { image: `https://i.pravatar.cc/150?u=${user.email}` } }
    }
  }));

  const result = await User.bulkWrite(bulkOps);
  console.log(`Updated ${result.modifiedCount} users with default images.`);
}