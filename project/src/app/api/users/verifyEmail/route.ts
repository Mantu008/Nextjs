import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

// Ensure the database connection is established
connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log("Received token:", token);

    // Find the user by token and ensure the token has not expired
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // Handle case where no user is found
    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }

    console.log("User found:", user);

    // Update user verification status
    user.isVerified = true; // Corrected field name
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    // Save the updated user
    await user.save();

    // Respond with success message
    return NextResponse.json({
      message: "Email verified successfully",
      success: true, // Corrected spelling
    });
  } catch (error: any) {
    // Log the error and respond with error message
    console.error("Error during token verification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
