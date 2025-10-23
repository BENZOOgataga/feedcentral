import { RSSSourceConfig } from "@/types";

export const RSS_SOURCES: RSSSourceConfig[] = [
  // Technology
  {
    name: "Techmeme",
    url: "https://www.techmeme.com/feed.xml",
    category: "Technology",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Technology",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Technology",
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/rss",
    category: "Technology",
  },

  // Cybersecurity
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    category: "Cybersecurity",
  },
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "Cybersecurity",
  },
  {
    name: "Bleeping Computer",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "Cybersecurity",
  },

  // World News
  {
    name: "Reuters World",
    url: "https://feeds.reuters.com/reuters/worldNews",
    category: "World News",
  },
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "World News",
  },
  {
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    category: "World News",
  },

  // Business and Finance
  {
    name: "Wall Street Journal Markets",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    category: "Business and Finance",
  },
  {
    name: "Bloomberg Markets",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    category: "Business and Finance",
  },
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rss",
    category: "Business and Finance",
  },

  // Science
  {
    name: "Science Daily",
    url: "https://www.sciencedaily.com/rss/all.xml",
    category: "Science",
  },
  {
    name: "NYT Science",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
    category: "Science",
  },
  {
    name: "Phys.org",
    url: "https://phys.org/rss-feed/",
    category: "Science",
  },

  // Programming
  {
    name: "Dev.to",
    url: "https://dev.to/feed",
    category: "Programming",
  },
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "Programming",
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    category: "Programming",
  },

  // Infrastructure and DevOps
  {
    name: "DevOps.com",
    url: "https://devops.com/feed/",
    category: "Infrastructure and DevOps",
  },
  {
    name: "Kubernetes Blog",
    url: "https://kubernetes.io/feed.xml",
    category: "Infrastructure and DevOps",
  },
  {
    name: "AWS Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "Infrastructure and DevOps",
  },

  // AI and Machine Learning
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss",
    category: "AI and Machine Learning",
  },
  {
    name: "Google AI Blog",
    url: "https://ai.googleblog.com/atom.xml",
    category: "AI and Machine Learning",
  },
  {
    name: "DeepMind Blog",
    url: "https://deepmind.google/discover/blog/rss.xml",
    category: "AI and Machine Learning",
  },
];
