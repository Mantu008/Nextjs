import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "6d835c424d7a2f",
        pass: "68574bc054e504",
      },
    });

    const mailOptions = {
      from: "mantukumar87586299@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #007bff; color: #ffffff; padding: 10px 0; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 10px; font-size: 12px; color: #999; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${
                emailType === "VERIFY"
                  ? "Verify Your Email"
                  : "Reset Your Password"
              }</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>${
                emailType === "VERIFY"
                  ? "Please verify your email address by clicking the link below."
                  : "Please reset your password by clicking the link below."
              }</p>
              <p>Click <a href="${
                process.env.DOMAIN
              }/verifyEmail?token=${hashedToken}">${
        emailType === "VERIFY" ? "here" : "here"
      }</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.<br>Or copy and paste the link below in your browser:</p>
              <p>${process.env.DOMAIN}/verifyEmail?token=${hashedToken}</p>
              <p>Best regards,<br>Your Company</p>
            </div>
            <div class="footer">
              <p>© 2024 Your Company. All rights reserved.</p>
              <p><a href="https://example.com/unsubscribe">Unsubscribe</a> from these emails.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transport.sendMail(mailOptions); // Correct method to send mail
  } catch (error: any) {
    console.error("Email sending failed:", error); // Log email sending errors
    throw new Error(error.message);
  }
};
