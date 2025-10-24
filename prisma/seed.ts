import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { getAdminCredentials } from '../lib/env';

const prisma = new PrismaClient();

async function main() {
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

  console.log('✓ Created categories:', categories.map(c => c.name).join(', '));

  // Create RSS sources
  const techCategory = categories.find(c => c.slug === 'tech')!;
  const scienceCategory = categories.find(c => c.slug === 'science')!;
  const businessCategory = categories.find(c => c.slug === 'business')!;
  const securityCategory = categories.find(c => c.slug === 'security')!;

  const sources = await Promise.all([
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
        fetchInterval: 30,
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
        fetchInterval: 30,
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
        fetchInterval: 30,
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
        fetchInterval: 30,
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
        fetchInterval: 60,
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
        fetchInterval: 60,
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
        fetchInterval: 60,
      },
    }),
    
    // Business sources
    prisma.source.upsert({
      where: { feedUrl: 'https://feeds.bloomberg.com/markets/news.rss' },
      update: {},
      create: {
        name: 'Bloomberg Markets',
        url: 'https://www.bloomberg.com',
        feedUrl: 'https://feeds.bloomberg.com/markets/news.rss',
        categoryId: businessCategory.id,
        isActive: true,
        fetchInterval: 30,
      },
    }),
    prisma.source.upsert({
      where: { feedUrl: 'https://www.forbes.com/business/feed/' },
      update: {},
      create: {
        name: 'Forbes Business',
        url: 'https://www.forbes.com',
        feedUrl: 'https://www.forbes.com/business/feed/',
        categoryId: businessCategory.id,
        isActive: true,
        fetchInterval: 30,
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
        fetchInterval: 60,
      },
    }),
    
    // Security sources
    prisma.source.upsert({
      where: { feedUrl: 'https://feeds.feedburner.com/TheHackersNews' },
      update: {},
      create: {
        name: 'The Hacker News',
        url: 'https://thehackernews.com',
        feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
        categoryId: securityCategory.id,
        isActive: true,
        fetchInterval: 30,
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
        fetchInterval: 60,
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
        fetchInterval: 60,
      },
    }),
  ]);

  console.log('✓ Created sources:', sources.map(s => s.name).join(', '));

  // Get admin credentials from environment
  const { username, password, passwordHash } = getAdminCredentials();
  
  // Use pre-hashed password if provided, otherwise hash the plain password
  const hashedPassword = passwordHash || await bcrypt.hash(password, 10);

  // Create or update admin user
  await prisma.user.upsert({
    where: { email: username },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: username,
      passwordHash: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('✓ Created admin user:', username);  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
