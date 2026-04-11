const WEBHOOK_URL = process.env.NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL || '';

const getIndianTime = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const d = String(ist.getUTCDate()).padStart(2, '0');
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const y = ist.getUTCFullYear();
  let h = ist.getUTCHours();
  const min = String(ist.getUTCMinutes()).padStart(2, '0');
  const sec = String(ist.getUTCSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${d}/${m}/${y}, ${String(h).padStart(2, '0')}:${min}:${sec} ${ampm} (IST)`;
};

export async function POST(req) {
  try {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('YOUR_ANALYTICS')) {
      return Response.json({ skipped: true });
    }

    const { ip, city, region, country, pincode, pageUrl, referrer, userAgent } = await req.json();

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: getIndianTime(),
        ip:        ip        || '',
        city:      city      || '',
        region:    region    || '',
        country:   country   || '',
        pincode:   pincode   || '',
        pageUrl:   pageUrl   || '',
        referrer:  referrer  || 'Direct',
        userAgent: userAgent || '',
      }),
    });

    return Response.json({ success: true });
  } catch (err) {
    // Silent — analytics must never affect the user experience
    console.error('track-visitor error:', err);
    return Response.json({ success: false });
  }
}
