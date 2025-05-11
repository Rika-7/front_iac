// app/api/filtered-projects/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the URL parameters
    const searchParams = request.nextUrl.searchParams;
    const types_to_register = searchParams.get("types_to_register");
    const preferred_researcher_level = searchParams.get(
      "preferred_researcher_level"
    );
    const limit = searchParams.get("limit") || "6";

    // Create the URL for your Azure backend
    // Make sure to set this environment variable in your .env.local file
    const backendUrl =
      process.env.BACKEND_URL ||
      "https://app-advanced3-5-g2ghbrhbb0brg9e7.canadacentral-01.azurewebsites.net";

    // Create the full URL with path and parameters
    const url = new URL("/filtered-projects", backendUrl);

    // Add the query parameters
    if (types_to_register) {
      url.searchParams.append("types_to_register", types_to_register);
    }

    if (preferred_researcher_level) {
      url.searchParams.append(
        "preferred_researcher_level",
        preferred_researcher_level
      );
    }

    url.searchParams.append("limit", limit);

    console.log("Fetching from:", url.toString());

    // Fetch data from the backend
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if needed
      },
    });

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(
        `Backend returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
