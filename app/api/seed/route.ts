import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { getAdminCredentials } from '@/lib/env';

const prisma = new PrismaClient();

/**
 * GET /api/seed
 * One-time endpoint to seed the production database
 * 
 * SECURITY: Set SEED_SECRET_KEY in Vercel environment variables
 * Usage: https://your-app.vercel.app/api/seed?key=YOUR_SECRET_KEY
 * 
 * IMPORTANT: Delete this file after running once!
 */
export async function GET(request: Request) {
  try {
    // Security check: Require secret key in production
    const { searchParams } = new URL(request.url);
    const providedKey = searchParams.get('key');
    const secretKey = process.env.SEED_SECRET_KEY;

    if (process.env.NODE_ENV === 'production') {
      if (!secretKey || providedKey !== secretKey) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unauthorized. Invalid or missing SEED_SECRET_KEY.' 
          },
          { status: 403 }
        );
      }
    }

    console.log('🌱 Starting database seed...');

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'tech' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'tech',
          icon: 'Cpu',
          color: '#7C5CFF',
          order: 1,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'science' },
        update: {},
        create: {
          name: 'Science',
          slug: 'science',
          icon: 'Atom',
          color: '#06b6d4',
          order: 2,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'business' },
        update: {},
        create: {
          name: 'Business',
          slug: 'business',
          icon: 'TrendingUp',
          color: '#10b981',
          order: 3,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'security' },
        update: {},
        create: {
          name: 'Security',
          slug: 'security',
          icon: 'Shield',
          color: '#ef4444',
          order: 4,
        },
      }),
    ]);

    console.log('✓ Created categories');

    // Create RSS sources
    const techCategory = categories[0];
    const scienceCategory = categories[1];
    const businessCategory = categories[2];
    const securityCategory = categories[3];

    await Promise.all([
      // Technology sources
      prisma.source.upsert({
        where: { feedUrl: 'https://techcrunch.com/feed/' },
        update: {},
        create: {
          name: 'TechCrunch',
          url: 'https://techcrunch.com',
          feedUrl: 'https://techcrunch.com/feed/',
          categoryId: techCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.theverge.com/rss/index.xml' },
        update: {},
        create: {
          name: 'The Verge',
          url: 'https://www.theverge.com',
          feedUrl: 'https://www.theverge.com/rss/index.xml',
          categoryId: techCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.engadget.com/rss.xml' },
        update: {},
        create: {
          name: 'Engadget',
          url: 'https://www.engadget.com',
          feedUrl: 'https://www.engadget.com/rss.xml',
          categoryId: techCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://feeds.arstechnica.com/arstechnica/index' },
        update: {},
        create: {
          name: 'Ars Technica',
          url: 'https://arstechnica.com',
          feedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
          categoryId: techCategory.id,
          isActive: true,
        },
      }),

      // Science sources
      prisma.source.upsert({
        where: { feedUrl: 'https://www.sciencedaily.com/rss/all.xml' },
        update: {},
        create: {
          name: 'ScienceDaily',
          url: 'https://www.sciencedaily.com',
          feedUrl: 'https://www.sciencedaily.com/rss/all.xml',
          categoryId: scienceCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.technologyreview.com/feed/' },
        update: {},
        create: {
          name: 'MIT Technology Review',
          url: 'https://www.technologyreview.com',
          feedUrl: 'https://www.technologyreview.com/feed/',
          categoryId: scienceCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://phys.org/rss-feed/' },
        update: {},
        create: {
          name: 'Phys.org',
          url: 'https://phys.org',
          feedUrl: 'https://phys.org/rss-feed/',
          categoryId: scienceCategory.id,
          isActive: true,
        },
      }),

      // Business sources
      prisma.source.upsert({
        where: { feedUrl: 'https://www.bloomberg.com/feed/podcast/etf-report.xml' },
        update: {},
        create: {
          name: 'Bloomberg',
          url: 'https://www.bloomberg.com',
          feedUrl: 'https://www.bloomberg.com/feed/podcast/etf-report.xml',
          categoryId: businessCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.forbes.com/real-time/feed2/' },
        update: {},
        create: {
          name: 'Forbes',
          url: 'https://www.forbes.com',
          feedUrl: 'https://www.forbes.com/real-time/feed2/',
          categoryId: businessCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.entrepreneur.com/latest.rss' },
        update: {},
        create: {
          name: 'Entrepreneur',
          url: 'https://www.entrepreneur.com',
          feedUrl: 'https://www.entrepreneur.com/latest.rss',
          categoryId: businessCategory.id,
          isActive: true,
        },
      }),

      // Security sources
      prisma.source.upsert({
        where: { feedUrl: 'https://feeds.feedburner.com/TheHackersNews' },
        update: {},
        create: {
          name: 'Hacker News',
          url: 'https://thehackernews.com',
          feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
          categoryId: securityCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://krebsonsecurity.com/feed/' },
        update: {},
        create: {
          name: 'Krebs on Security',
          url: 'https://krebsonsecurity.com',
          feedUrl: 'https://krebsonsecurity.com/feed/',
          categoryId: securityCategory.id,
          isActive: true,
        },
      }),
      prisma.source.upsert({
        where: { feedUrl: 'https://www.schneier.com/feed/atom/' },
        update: {},
        create: {
          name: 'Schneier on Security',
          url: 'https://www.schneier.com',
          feedUrl: 'https://www.schneier.com/feed/atom/',
          categoryId: securityCategory.id,
          isActive: true,
        },
      }),
    ]);

    console.log('✓ Created RSS sources');

    // Create admin user
    const { username, password } = getAdminCredentials();
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email: username },
      update: {},
      create: {
        email: username,
        passwordHash,
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    console.log('✓ Created admin user:', username);
    console.log('✅ Database seeding completed!');

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully!',
      details: {
        categories: 4,
        sources: 13,
        adminUser: username,
      },
      warning: '⚠️ REMEMBER TO DELETE THIS /api/seed ENDPOINT AFTER USE!',
    });
  } catch (error: any) {
    console.error('❌ Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
