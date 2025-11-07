import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://feed.benzoogataga.com';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    {
      url: `${baseUrl}/app`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/app`,
          fr: `${baseUrl}/fr/app`,
        },
      },
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/changelog`,
          fr: `${baseUrl}/fr/changelog`,
        },
      },
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/roadmap`,
          fr: `${baseUrl}/fr/roadmap`,
        },
      },
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/sources`,
          fr: `${baseUrl}/fr/sources`,
        },
      },
    },
    {
      url: `${baseUrl}/contributors`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contributors`,
          fr: `${baseUrl}/fr/contributors`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
          fr: `${baseUrl}/fr/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${baseUrl}/en/terms`,
          fr: `${baseUrl}/fr/terms`,
        },
      },
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/cookies`,
          fr: `${baseUrl}/fr/cookies`,
        },
      },
    },
  ];
}
