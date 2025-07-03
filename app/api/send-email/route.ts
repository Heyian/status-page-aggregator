import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { subject, message, to } = await request.json();

    // Get email configuration from environment variables
    const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
    const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const SLACK_EMAIL = process.env.SLACK_EMAIL;

    // Validate required environment variables
    if (!EMAIL_USER || !EMAIL_PASS) {
      return NextResponse.json(
        {
          error:
            "Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.",
        },
        { status: 500 }
      );
    }

    // Use SLACK_EMAIL as default recipient if not provided in request
    const recipient = to || SLACK_EMAIL;

    if (!recipient) {
      return NextResponse.json(
        {
          error:
            'No recipient email provided. Set SLACK_EMAIL environment variable or provide "to" in request body.',
        },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Send email
    // Send email
    const info = await transporter.sendMail({
      from: `"Status Page Alert" <${EMAIL_USER}>`,
      to: recipient,
      subject: subject || "Status Page Notification",
      text: message,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">${subject || "Status Page Notification"}</h2>
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="color: #555; line-height: 1.6;">${message
      ?.replace(/\n/g, "<br>")
      .replace(
        /More information at: (https?:\/\/[^\s]+)/g,
        '<a href="$1" style="color: #0066cc; text-decoration: underline;">View Status Page</a><br>'
      )}</p>
  </div>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="color: #888; font-size: 12px;">This email was sent from your Status Page Aggregator</p>
</div>`,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test email configuration
export async function GET() {
  try {
    const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
    const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const SLACK_EMAIL = process.env.SLACK_EMAIL;

    const config = {
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      user: EMAIL_USER ? "***configured***" : "missing",
      pass: EMAIL_PASS ? "***configured***" : "missing",
      recipient: SLACK_EMAIL || "not set",
    };

    return NextResponse.json({
      message: "Email API is ready",
      configuration: config,
      ready: !!(EMAIL_USER && EMAIL_PASS),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to check configuration", details: error.message },
      { status: 500 }
    );
  }
}
