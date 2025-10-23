import { NextResponse } from 'next/server';

export async function GET() {
  // Mock response - replace with actual database queries
  return NextResponse.json({
    success: true,
    data: {
      totalArticles: 0,
      todayArticles: 0,
      activeSources: 0,
      categories: [],
      recentJobs: [],
    },
  });
}
