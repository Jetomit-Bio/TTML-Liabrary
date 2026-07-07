import { MetadataRoute } from 'next';
import { getDbPool } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ttmllib.xyz';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/add`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms/distributor`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  try {
    const pool = getDbPool();
    const [rows]: any = await pool.execute(
      'SELECT id, created_at FROM tracks ORDER BY id DESC LIMIT 50000'
    );

    const trackUrls = rows.map((track: any) => ({
      url: `${baseUrl}/lyrics/${track.id}`,
      lastModified: track.created_at ? new Date(track.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...trackUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
