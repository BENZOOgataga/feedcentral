import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Database seeding endpoint
 * Security: Protected by SEED_SECRET_KEY environment variable
 * Usage: GET /api/admin/seed?key=YOUR_SECRET_KEY
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const providedKey = searchParams.get('key');
    const expectedKey = process.env.SEED_SECRET_KEY;

    // Check if seeding is enabled
    if (!expectedKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seeding is disabled',
          message: 'Set SEED_SECRET_KEY environment variable to enable database seeding'
        },
        { status: 503 }
      );
    }

    // Verify the secret key
    if (providedKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🌱 Starting database seed...');

    // Seed categories
    const categories = [
      { name: 'Technology', slug: 'tech', icon: 'Cpu', color: '#7C5CFF', order: 1 },
      { name: 'Security', slug: 'security', icon: 'Shield', color: '#ef4444', order: 2 },
      { name: 'Business', slug: 'business', icon: 'TrendingUp', color: '#10b981', order: 3 },
      { name: 'Science', slug: 'science', icon: 'Atom', color: '#06b6d4', order: 4 },
    ];

    const categoryRecords = [];
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, icon: cat.icon, color: cat.color, order: cat.order },
        create: cat,
      });
      categoryRecords.push(category);
    }

    // Seed RSS sources
    const sources = [
      { name: 'TechCrunch', url: 'https://techcrunch.com', feedUrl: 'https://techcrunch.com/feed/', categorySlug: 'tech', isActive: true },
      { name: 'The Verge', url: 'https://www.theverge.com', feedUrl: 'https://www.theverge.com/rss/index.xml', categorySlug: 'tech', isActive: true },
      { name: 'Engadget', url: 'https://www.engadget.com', feedUrl: 'https://www.engadget.com/rss.xml', categorySlug: 'tech', isActive: true },
      { name: 'Ars Technica', url: 'https://arstechnica.com', feedUrl: 'https://feeds.arstechnica.com/arstechnica/index', categorySlug: 'tech', isActive: true },
      { name: 'Hacker News', url: 'https://news.ycombinator.com', feedUrl: 'https://hnrss.org/frontpage', categorySlug: 'tech', isActive: true },
      { name: 'Schneier on Security', url: 'https://www.schneier.com', feedUrl: 'https://www.schneier.com/feed/atom/', categorySlug: 'security', isActive: true },
      { name: 'Krebs on Security', url: 'https://krebsonsecurity.com', feedUrl: 'https://krebsonsecurity.com/feed/', categorySlug: 'security', isActive: true },
      { name: 'Bloomberg', url: 'https://www.bloomberg.com', feedUrl: 'https://www.bloomberg.com/feed/podcast/business.xml', categorySlug: 'business', isActive: true },
      { name: 'Forbes', url: 'https://www.forbes.com', feedUrl: 'https://www.forbes.com/real-time/feed2/', categorySlug: 'business', isActive: true },
      { name: 'Entrepreneur', url: 'https://www.entrepreneur.com', feedUrl: 'https://www.entrepreneur.com/latest.rss', categorySlug: 'business', isActive: true },
      { name: 'ScienceDaily', url: 'https://www.sciencedaily.com', feedUrl: 'https://www.sciencedaily.com/rss/all.xml', categorySlug: 'science', isActive: true },
      { name: 'Phys.org', url: 'https://phys.org', feedUrl: 'https://phys.org/rss-feed/', categorySlug: 'science', isActive: true },
      { name: 'MIT Technology Review', url: 'https://www.technologyreview.com', feedUrl: 'https://www.technologyreview.com/feed/', categorySlug: 'science', isActive: true },
    ];

    const sourceRecords = [];
    for (const src of sources) {
      const category = categoryRecords.find((c) => c.slug === src.categorySlug);
      if (!category) continue;

      const source = await prisma.source.upsert({
        where: { feedUrl: src.feedUrl },
        update: { name: src.name, url: src.url, categoryId: category.id, isActive: src.isActive },
        create: { name: src.name, url: src.url, feedUrl: src.feedUrl, categoryId: category.id, isActive: src.isActive },
      });
      sourceRecords.push(source);
    }

    // Seed admin user
    const adminEmail = process.env.ADMIN_USERNAME || 'admin@feedcentral.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: hashedPassword },
      create: {
        email: adminEmail,
        name: 'Admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Database seeded successfully');

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully!',
      details: {
        categories: categoryRecords.length,
        sources: sourceRecords.length,
        adminUser: adminEmail,
      },
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
