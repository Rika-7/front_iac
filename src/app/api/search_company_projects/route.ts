import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || '';
  const budgetRange = searchParams.get('budget_range') || '';
  const deadlineRange = searchParams.get('deadline_range') || '';

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/matting-projects?keyword=${encodeURIComponent(
      keyword
    )}&budget_range=${budgetRange}&deadline_range=${deadlineRange}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
