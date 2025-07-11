"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
      © {new Date().getFullYear()} AI Workspace. Built with ❤️ using Next.js &
      Tailwind.
    </footer>
  );
}
