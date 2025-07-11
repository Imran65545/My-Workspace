import { connectDB } from "@/lib/mongodb";
import Note from "@/models/note";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const notes = await Note.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });
  return Response.json(notes);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { content } = await req.json();
  console.log("SESSION IN /api/notes POST:", JSON.stringify(session));
  console.log("Creating note with:", { userId: session.user?.id, content });

  try {
    const note = await Note.create({ userId: session.user.id, content }); // ✅ should now work
    return Response.json(note);
  } catch (err) {
    console.error("Note creation error:", err);
    return new Response("Note creation error: " + err, { status: 500 });
  }
}

export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, content } = await req.json();
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { content },
      { new: true }
    );
    if (!note) return new Response("Note not found", { status: 404 });
    return Response.json(note);
  } catch (err) {
    return new Response("Note update error: " + err, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  try {
    const note = await Note.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!note) return new Response("Note not found", { status: 404 });
    return Response.json({ success: true });
  } catch (err) {
    return new Response("Note delete error: " + err, { status: 500 });
  }
}
