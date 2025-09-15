export async function handler(event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  try {
    // Path comes from the function path segment after /wb/
    const rawPath = event.path || '';
    const match = rawPath.match(/\/wb\/(.*)$/);
    const path = match && match[1] ? match[1] : '';
    if (!path) {
      return { statusCode: 400, headers: corsHeaders, body: 'Missing path' };
    }
    const upstream = `https://a.windbornesystems.com/${path}`;

    const upstreamRes = await fetch(upstream, { method: 'GET' });
    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const textBody = await upstreamRes.text();

    return {
      statusCode: upstreamRes.status,
      headers: { ...corsHeaders, 'Content-Type': contentType },
      body: textBody,
    };
  } catch (err) {
    return { statusCode: 502, headers: corsHeaders, body: 'Upstream fetch failed' };
  }
}


