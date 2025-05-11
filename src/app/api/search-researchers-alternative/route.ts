import { NextResponse } from "next/server";
import { Researcher } from "@/types/project";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call the main API endpoint to get the base researchers
    // Note: Next.js API routes cannot call themselves directly
    // Using the full URL with NEXT_PUBLIC_API_URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(`${apiUrl}/api/search-researchers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const researchers = (await response.json()) as Researcher[];

    // Apply the alternative algorithm
    const alternativeResults: Researcher[] = researchers.map((researcher) => {
      // Simple score modification for demonstration purposes
      const adjustedScore = Math.min(
        1.0,
        Math.max(0.1, researcher.score * (0.5 + Math.random() * 0.7))
      );

      return {
        ...researcher,
        score: adjustedScore,
        explanation: `代替アルゴリズム評価: ${researcher.explanation}`,
      };
    });

    // Sort by the new scores
    alternativeResults.sort((a, b) => b.score - a.score);

    return NextResponse.json(alternativeResults);
  } catch (error) {
    console.error("Error in alternative matching:", error);
    return NextResponse.json(
      { error: "Failed to get alternative matching results" },
      { status: 500 }
    );
  }
}
