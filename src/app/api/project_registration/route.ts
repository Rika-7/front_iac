import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search-researchers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        university: "東京科学大学",  // 固定
        top_k: 10,                   // 固定
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
