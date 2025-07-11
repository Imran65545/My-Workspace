// app/api/auth/signup/route.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  return new Response(
    JSON.stringify({ message: "User created", user: newUser }),
    { status: 201 }
  );
}
