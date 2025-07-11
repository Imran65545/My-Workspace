// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default: function () {
      // Use a gravatar or pravatar based on email for uniqueness
      return `https://i.pravatar.cc/150?u=${this.email}`;
    },
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
