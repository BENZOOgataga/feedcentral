/**
 * Backfill script to populate database with historical articles
 * Fetches all available articles from RSS feeds (typically last 7-30 days)
 * 
 * Usage: node scripts/backfill-feeds.js
 */

const { PrismaClient } = require('@prisma/client');
const Parser = require('rss-parser');

const prisma = new PrismaClient();
const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'FeedCentral/1.0 (Backfill Script)',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

// HTML entity decoder
function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&hellip;': '\u2026',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec));
  });

  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

// Extract image from RSS item
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
  
  const ogImageMatch = item.content?.match(/<meta property="og:image" content="([^"]+)"/);
  if (ogImageMatch) return ogImageMatch[1];
  
  const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

// Extract content from RSS item
function extractContent(item) {
  if (item.contentEncoded) {
    return item.contentEncoded
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
  }
  if (item.content) {
    return item.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
  }
  return null;
}

// Fetch and store articles for a single source
async function backfillSource(source) {
  console.log(`\n📡 Fetching ${source.name}...`);
  
  try {
    const feed = await parser.parseURL(source.feedUrl);
    const items = feed.items || [];
    
    console.log(`   Found ${items.length} articles in feed`);
    
    if (items.length === 0) {
      return { source: source.name, found: 0, added: 0 };
    }

    // Parse all articles
    const articles = items.map(item => {
      const imageUrl = extractImage(item);
      const content = extractContent(item);
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

      return {
        title: decodeHtmlEntities(item.title || 'Untitled'),
        description: decodeHtmlEntities(item.contentSnippet || item.summary || ''),
        content,
        url: item.link || '',
        imageUrl,
        author: item.creator || item.author || null,
        publishedAt,
        sourceId: source.id,
        categoryId: source.categoryId,
      };
    });

    // Get existing URLs to avoid duplicates
    const existingUrls = new Set(
      (await prisma.article.findMany({
        where: {
          sourceId: source.id,
          url: { in: articles.map(a => a.url) },
        },
        select: { url: true },
      })).map(a => a.url)
    );

    // Filter out duplicates
    const newArticles = articles.filter(article => !existingUrls.has(article.url));
    
    console.log(`   New articles: ${newArticles.length} (${existingUrls.size} duplicates skipped)`);

    // Batch insert
    if (newArticles.length > 0) {
      await prisma.article.createMany({
        data: newArticles,
        skipDuplicates: true,
      });
      console.log(`   ✅ Added ${newArticles.length} articles`);
    }

    // Update source last fetched time
    await prisma.source.update({
      where: { id: source.id },
      data: { lastFetchedAt: new Date() },
    });

    return {
      source: source.name,
      found: items.length,
      added: newArticles.length,
      duplicates: existingUrls.size,
    };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      source: source.name,
      found: 0,
      added: 0,
      error: error.message,
    };
  }
}

// Main backfill function
async function backfillAllFeeds() {
  console.log('🚀 Starting RSS feed backfill...\n');
  const startTime = Date.now();

  try {
    // Get all active sources
    const sources = await prisma.source.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    console.log(`Found ${sources.length} active sources\n`);
    console.log('='.repeat(60));

    const results = [];

    // Process sources sequentially to be gentle on RSS servers
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      console.log(`\n[${i + 1}/${sources.length}] Processing ${source.name}`);
      
      const result = await backfillSource(source);
      results.push(result);

      // Small delay between requests to be polite
      if (i < sources.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalFound = results.reduce((sum, r) => sum + r.found, 0);
    const totalAdded = results.reduce((sum, r) => sum + r.added, 0);
    const totalErrors = results.filter(r => r.error).length;

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 BACKFILL SUMMARY\n');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📡 Sources processed: ${sources.length}`);
    console.log(`📰 Articles found: ${totalFound}`);
    console.log(`✅ Articles added: ${totalAdded}`);
    console.log(`🔄 Duplicates skipped: ${totalFound - totalAdded}`);
    console.log(`❌ Errors: ${totalErrors}`);

    if (totalErrors > 0) {
      console.log('\n❌ Failed sources:');
      results.filter(r => r.error).forEach(r => {
        console.log(`   - ${r.source}: ${r.error}`);
      });
    }

    console.log('\n✨ Backfill complete!\n');

    // Show top sources by articles added
    const topSources = results
      .filter(r => r.added > 0)
      .sort((a, b) => b.added - a.added)
      .slice(0, 5);

    if (topSources.length > 0) {
      console.log('🏆 Top sources by articles added:');
      topSources.forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.source}: ${r.added} articles`);
      });
    }

  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run backfill
backfillAllFeeds();
