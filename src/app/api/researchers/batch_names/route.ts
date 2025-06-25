import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the external API URL from environment variables
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://app-advanced3-5-g2qhbrhbb0brg9e7.canadacentral-01.azurewebsites.net";

    console.log(
      "Calling external batch_names API:",
      `${apiUrl}/researchers/batch_names`
    );
    console.log("Request body:", body);

    // Call the external API
    const response = await fetch(`${apiUrl}/researchers/batch_names`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API error:", errorText);
      throw new Error(
        `External API responded with status: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("External API response data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in batch_names API route:", error);
    return NextResponse.json(
      {
        error: "Failed to get researcher names",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
