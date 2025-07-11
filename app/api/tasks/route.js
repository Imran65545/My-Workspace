import { connectDB } from "@/lib/mongodb";
import Task from "@/models/task";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const tasks = await Task.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });
  return Response.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { text } = await req.json();
  const task = await Task.create({ userId: session.user.id, text });
  return Response.json(task);
}

export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, done, text } = await req.json();
  const update = {};
  if (typeof done !== 'undefined') update.done = done;
  if (typeof text !== 'undefined') update.text = text;

  const updated = await Task.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    update,
    { new: true }
  );
  if (!updated) return new Response("Task not found", { status: 404 });
  return Response.json(updated);
}
