import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const { action, name, email, message } = body;
    if (!action) {
      return NextResponse.json(
        { error: "Action is required." },
        { status: 400 }
      );
    }

    switch (action) {
      case "sendEmail":
        if (!name || !email || !message) {
          return NextResponse.json(
            {
              error: "Name, email, and message are required for sending email.",
            },
            { status: 400 }
          );
        }

        // Simulate sending email data to the backend or an email service
        const response = await fetch(`${API_URL}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || "Failed to send email." },
            { status: response.status }
          );
        }

        return NextResponse.json(
          { success: true, message: "Email data sent successfully." },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          { error: "Invalid action specified." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
