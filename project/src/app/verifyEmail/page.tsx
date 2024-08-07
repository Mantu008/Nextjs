"use client"; // Correctly marks this file as a Client Component

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data); // Added optional chaining for error.response
    }
  };

  useEffect(() => {
    // Extract token from URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="text-2xl bg-orange-700 mt-3 p-2">
        {token ? `${token}` : "No Token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">
            <p className="text-blue-500">Login</p>
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-2xl bg-red-600 text-black">Error</h2>
          <Link href="/login">
            <p className="text-blue-500">Login</p>
          </Link>
        </div>
      )}
    </div>
  );
}
