import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the external API URL from environment variables
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://app-advanced3-5-g2qhbrhbb0brg9e7.canadacentral-01.azurewebsites.net";

    // FIX: Use correct endpoint name with hyphen (compare-patterns, not compare_patterns)
    console.log("Calling external API:", `${apiUrl}/compare-patterns`);
    console.log("Request body:", body);

    // Call the external API with the correct endpoint name
    const response = await fetch(`${apiUrl}/compare-patterns`, {
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
    console.log("External API response received successfully");

    // Return the data directly - no modifications needed
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in compare-patterns API route:", error);
    return NextResponse.json(
      {
        error: "Failed to get pattern comparison results",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
