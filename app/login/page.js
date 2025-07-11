"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok && !res.error) {
      toast.success("Login successful!", { position: "top-right" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } else {
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 space-y-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="mx-2 text-gray-400">or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.528 2.848-2.12 5.26-4.52 6.88v5.68h7.32c4.28-3.94 6.73-9.74 6.73-16.876z" fill="#4285F4"/><path d="M24.48 48c6.12 0 11.26-2.04 15.01-5.54l-7.32-5.68c-2.04 1.36-4.66 2.18-7.69 2.18-5.92 0-10.94-4-12.74-9.36H4.25v5.84C7.99 43.98 15.62 48 24.48 48z" fill="#34A853"/><path d="M11.74 29.6c-.48-1.36-.76-2.8-.76-4.28s.28-2.92.76-4.28v-5.84H4.25A23.98 23.98 0 0 0 0 24c0 3.98.96 7.74 2.65 11.04l9.09-5.44z" fill="#FBBC05"/><path d="M24.48 9.52c3.34 0 6.32 1.14 8.68 3.38l6.48-6.48C35.74 2.18 30.6 0 24.48 0 15.62 0 7.99 4.02 4.25 10.16l9.09 5.84c1.8-5.36 6.82-9.36 12.74-9.36z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
        Sign in with Google
      </button>
    </form>
  );
}
