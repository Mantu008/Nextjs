"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

export default function Page({ params }: any) {
  const [data, setData] = useState("nothing");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleGetUserDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/me");
      setData(res.data.data.username);
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Profile Page</p>
      <br />
      <h1>
        {data === "nothing" ? (
          ""
        ) : (
          <Link
            className="text-white bg-orange-700 p-2 rounded-md"
            href={`/profile/${data}`}
          >
            {data}
          </Link>
        )}
      </h1>
      <br />
      <button className="bg-blue-600 p-3 rounded-md" onClick={handleLogout}>
        LogOut
      </button>
      <br />
      <button
        className="bg-green-600 p-2 h-[50px] w-[100px] rounded-md"
        onClick={handleGetUserDetail}
      >
        {loading ? <ClipLoader /> : "Get Detail"}
      </button>
    </div>
  );
}
