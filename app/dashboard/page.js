"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import NotesTab from "@/components/NotesTab";
import TasksTab from "@/components/TasksTab";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("notes");
  const { data: session } = useSession();

  // Debug: log session and user image
  console.log("SESSION OBJECT:", session);
  console.log("USER IMAGE:", session?.user?.image);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-black hover:underline cursor-pointer">My Workspace</Link>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setActiveTab("notes")}
            className={
              (activeTab === "notes"
                ? "text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500") +
              " transition duration-200 hover:underline hover:scale-105"
            }
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={
              (activeTab === "tasks"
                ? "text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500") +
              " transition duration-200 hover:underline hover:scale-105"
            }
          >
            Tasks
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-red-600 font-semibold transition duration-200 hover:underline hover:scale-105"
          >
            Logout
          </button>
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ml-2 border border-gray-300"
              style={{ display: "inline-block" }}
            />
          )}
        </div>
      </nav>

      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === "notes" ? <NotesTab /> : <TasksTab />}
      </main>
    </div>
  );
}
