"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      toast.success("Account created successfully!", { position: "top-right" });
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } else {
      alert("Signup failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold">Signup</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border"
      />
      <input
        placeholder="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Create Account
      </button>
    </form>
  );
}
