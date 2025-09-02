"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import NotesTab from "@/components/NotesTab";
import TasksTab from "@/components/TasksTab";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("notes");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white/80 backdrop-blur shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/" className="text-base sm:text-lg font-bold text-gray-900 tracking-tight truncate">
              My Workspace
            </Link>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop tabs */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === "notes"
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-current={activeTab === "notes" ? "page" : undefined}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === "tasks"
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-current={activeTab === "tasks" ? "page" : undefined}
              >
                Tasks
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {session?.user?.name && (
                <span className="hidden sm:block text-sm text-gray-700">
                  {session.user.name}
                </span>
              )}
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              )}
              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-2 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
                <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
                <span className="block w-5 h-0.5 bg-gray-700" />
              </button>
              {/* Desktop logout */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hidden sm:inline-block text-sm text-red-600 hover:text-red-700 px-2 sm:px-3 py-1.5 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in drawer + overlay */}
      <div
        className={`sm:hidden fixed inset-0 z-40 ${mobileMenuOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Menu</span>
              <button
                className="p-2 rounded-md border border-gray-200 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 w-full">
              <button
                onClick={() => {
                  setActiveTab("notes");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === "notes"
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => {
                  setActiveTab("tasks");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === "tasks"
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tasks
              </button>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-sm text-red-700 px-3 py-2 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="p-3 sm:p-6 pb-24 sm:pb-6 max-w-5xl mx-auto">
        {activeTab === "notes" ? <NotesTab /> : <TasksTab />}
      </main>

      {/* Mobile bottom tab bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex flex-col items-center text-xs ${
              activeTab === "notes" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              activeTab === "notes" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
            }`}>N</span>
            Notes
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex flex-col items-center text-xs ${
              activeTab === "tasks" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              activeTab === "tasks" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
            }`}>T</span>
            Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
