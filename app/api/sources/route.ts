import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: [
        { category: { order: 'asc' } },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}
