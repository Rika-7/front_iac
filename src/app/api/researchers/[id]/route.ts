import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const researcherId = params.id;

    // Get the external API URL from environment variables
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://app-advanced3-5-g2qhbrhbb0brg9e7.canadacentral-01.azurewebsites.net";

    console.log(
      "Calling external researcher API:",
      `${apiUrl}/researchers/${researcherId}`
    );

    // Call the external API
    const response = await fetch(`${apiUrl}/researchers/${researcherId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    console.error("Error in individual researcher API route:", error);
    return NextResponse.json(
      {
        error: "Failed to get researcher data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
