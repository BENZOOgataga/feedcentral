import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/app/settings/'],
      },
    ],
    sitemap: 'https://feed.benzoogataga.com/sitemap.xml',
  };
}
