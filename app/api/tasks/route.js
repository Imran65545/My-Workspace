import { connectDB } from "@/lib/mongodb";
import Task from "@/models/task";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const tasks = await Task.find({ userId: session.user.id }).sort({
    order: 1,
    createdAt: -1,
  });
  return Response.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { text, dueDate, priority } = await req.json();
  // Determine next order
  const last = await Task.findOne({ userId: session.user.id }).sort({ order: -1 });
  const nextOrder = last?.order != null ? last.order + 1 : 0;
  const task = await Task.create({
    userId: session.user.id,
    text,
    dueDate: dueDate ? new Date(dueDate) : null,
    priority: priority || "medium",
    order: nextOrder,
  });
  return Response.json(task);
}

export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, done, text, dueDate, priority, order } = await req.json();
  const update = {};
  if (typeof done !== 'undefined') update.done = done;
  if (typeof text !== 'undefined') update.text = text;
  if (typeof dueDate !== 'undefined') update.dueDate = dueDate ? new Date(dueDate) : null;
  if (typeof priority !== 'undefined') update.priority = priority;
  if (typeof order !== 'undefined') update.order = order;

  const updated = await Task.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    update,
    { new: true }
  );
  if (!updated) return new Response("Task not found", { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  const deleted = await Task.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!deleted) return new Response("Task not found", { status: 404 });
  return new Response(null, { status: 204 });
}
