export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  artists: Array<{ name: string }>;
  album: {
    name: string;
    release_date: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
}

export async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn('[Spotify] Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables');
    return null;
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[Spotify Auth Error] Response status:', response.status);
      return null;
    }
    const data = await response.json();
    return data.access_token || null;
  } catch (err) {
    console.error('[Spotify Auth Exception]:', err);
    return null;
  }
}

export async function searchSpotifyTrack(
  title: string,
  artist?: string
): Promise<SpotifyTrack | null> {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const queryStr = artist && artist.trim() !== '' ? `track:${title} artist:${artist}` : title;
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(queryStr)}&type=track&limit=1`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const track: SpotifyTrack | undefined = data.tracks?.items?.[0];
    return track || null;
  } catch (err) {
    console.error('[Spotify Search Error]:', err);
    return null;
  }
}
