"use client";
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/users/signup", {
        // Ensure correct endpoint
        username,
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Signup Successful");
        router.push("/login");
      } else {
        toast.error("Signup Failed");
      }

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Signup failed:", error); // Log the error
      toast.error(
        "Signup Failed: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username && email && password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [username, email, password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-slate-800 font-bold">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {loading ? <ClipLoader /> : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 hover:cursor-pointer"
            disabled={btnDisabled}
          >
            {btnDisabled ? "Fill all fields" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
