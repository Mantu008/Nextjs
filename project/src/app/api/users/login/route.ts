import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if user is already present
    const user = await User.findOne({ email });

    if (user) {
      // Compare the hashed password
      const isMatch = await bcryptjs.compare(password, user.password);

      if (isMatch) {
        //check user is VErified or not

        if (!user.isVerfied) {
          return NextResponse.json(
            {
              message: "Please Veriify The User At Email",
              success: false,
            },
            { status: 401 }
          );
        }

        // Password is correct
        // Remove the password before sending the response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Create token data
        const tokenData = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        // Create Token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
          expiresIn: "2h",
        });

        // Create response and set cookie
        const response = NextResponse.json({
          message: "Login Successful",
          success: true,
        });

        response.cookies.set("token", token, {
          httpOnly: true,
        });

        return response;
      } else {
        // Password is incorrect
        return NextResponse.json(
          {
            message: "Invalid Password",
            success: false,
          },
          { status: 401 }
        );
      }
    } else {
      // User not found
      return NextResponse.json(
        {
          message: "User Not Found",
          success: false,
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    // Handle unexpected errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
