# Passive Visitor Tracking — Implementation Guide

This guide documents the complete visitor analytics system built for BookMyCorporateParty.
Hand this file to any agent and it can implement the identical system in a different Next.js project.
Zero cookies. Zero consent banners. No UI impact whatsoever.

---

## What It Does

Every time a visitor opens the page, the system silently:
1. Fetches their IP, city, region, country, pincode from a free API (ipapi.co)
2. Reads their page URL, referrer, and user agent from the browser
3. Fires a single POST to a Next.js API route (invisible to the user)
4. That API route forwards everything to a Google Apps Script webhook
5. The Apps Script writes one row to a Google Sheet — timestamped in IST

Result: a permanent log of every visitor with location, source, and device info, stored in Google Sheets for free, with no third-party analytics account needed.

---

## Architecture

```
Browser
  └── useGeoLocation hook  ←  fetches https://ipapi.co/json/  (once, on mount)
       └── useEffect in page component
            └── POST /api/track-visitor  (Next.js API route)
                 └── fetch → Google Apps Script webhook URL
                      └── Apps Script writes one row to Google Sheet
```

---

## File 1 — Geolocation Hook

**Path:** `src/hooks/useGeoLocation.ts`

```typescript
"use client";

import { useState, useEffect } from 'react';

interface GeoLocation {
  city: string;
  region: string;
  pincode: string;
  country: string;
  ip: string;
}

const useGeoLocation = (): GeoLocation | null => {
  const [location, setLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return;
        const data = await response.json();
        setLocation({
          city:    data.city,
          region:  data.region,
          pincode: data.postal,
          country: data.country_name,
          ip:      data.ip,
        });
      } catch (err) {
        console.error('Geo fetch failed:', err);
      }
    };
    fetchGeo();
  }, []);

  return location;
};

export default useGeoLocation;
```

**Notes:**
- Uses [ipapi.co](https://ipapi.co) — free tier allows 1,000 requests/day, no API key needed.
- Returns `null` until the fetch resolves, so callers must check for null.
- The `"use client"` directive is required for Next.js App Router.

---

## File 2 — API Route

**Path:** `src/app/api/track-visitor/route.js`

```javascript
const WEBHOOK_URL = process.env.NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL || '';

const getIndianTime = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const d   = String(ist.getUTCDate()).padStart(2, '0');
  const m   = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const y   = ist.getUTCFullYear();
  let h     = ist.getUTCHours();
  const min = String(ist.getUTCMinutes()).padStart(2, '0');
  const sec = String(ist.getUTCSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${d}/${m}/${y}, ${String(h).padStart(2, '0')}:${min}:${sec} ${ampm} (IST)`;
};

export async function POST(req) {
  try {
    if (!WEBHOOK_URL) return Response.json({ skipped: true });

    const { ip, city, region, country, pincode, pageUrl, referrer, userAgent } = await req.json();

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: getIndianTime(),
        ip,
        city,
        region,
        country,
        pincode,
        pageUrl,
        referrer: referrer || 'Direct',
        userAgent,
      }),
    });

    return Response.json({ success: true });
  } catch (err) {
    // Silent — analytics must never crash or block the user experience
    console.error('track-visitor error:', err);
    return Response.json({ success: false });
  }
}
```

**Notes:**
- If `WEBHOOK_URL` is not set, it silently skips — safe for local dev.
- All errors are caught and suppressed so a Sheets failure never shows a 500 to the user.
- `getIndianTime()` produces IST timestamps. For other timezones change the `+ 5.5 * 60 * 60 * 1000` offset or use `toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })`.

---

## File 3 — Usage in the Page Component

**Path:** `src/app/page.tsx` (or any client component)

Add these three pieces:

```typescript
// 1. Import at top
import useGeoLocation from "../hooks/useGeoLocation";
import { useRef } from "react";

// 2. Inside the component, before return
const userGeo = useGeoLocation();
const visitorTracked = useRef(false);

useEffect(() => {
  if (!userGeo || visitorTracked.current) return;
  visitorTracked.current = true;                    // fire once only
  fetch('/api/track-visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ip:        userGeo.ip,
      city:      userGeo.city,
      region:    userGeo.region,
      country:   userGeo.country,
      pincode:   userGeo.pincode,
      pageUrl:   window.location.href,
      referrer:  document.referrer || 'Direct',
      userAgent: navigator.userAgent,
    }),
  }).catch(() => {});                               // silent on network failure
}, [userGeo]);
```

**Why `visitorTracked` ref?**
The `useEffect` fires every time `userGeo` changes. Without the ref guard it would send a new row every re-render. The ref ensures exactly one tracking call per page load.

**Bonus — reuse `userGeo` for form submissions:**
The same `userGeo` object can be passed into your lead form's submit payload to attach location data to every lead:
```typescript
body: JSON.stringify({
  ...formPayload,
  userLocation: userGeo ? `${userGeo.city}, ${userGeo.region}, ${userGeo.country}` : 'Unknown',
  userPincode:  userGeo ? userGeo.pincode : 'Unknown',
  userIp:       userGeo ? userGeo.ip      : 'Unknown',
})
```

---

## File 4 — Environment Variable

**File:** `.env.local`

```
NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

For Vercel: add this in **Project Settings → Environment Variables** (mark as Production + Preview).

---

## File 5 — Google Apps Script (the webhook)

### Step A — Create the Sheet

1. Open [sheets.google.com](https://sheets.google.com) → New spreadsheet.
2. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### Step B — Open Apps Script

1. In the sheet: **Extensions → Apps Script**
2. Delete all existing code, paste the script below.

### Step C — The Script

```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    var rowData = [
      data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.ip        || '',
      data.city      || '',
      data.region    || '',
      data.country   || '',
      data.pincode   || '',
      data.pageUrl   || '',
      data.referrer  || 'Direct',
      data.userAgent || '',
    ];

    var row = getFirstEmptyRow(sheet);
    sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'OK' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Always writes to the first genuinely empty row (handles deleted-row gaps)
function getFirstEmptyRow(sheet) {
  var values = sheet.getRange('A:A').getValues();
  for (var i = 1; i < values.length; i++) {
    if (!values[i][0]) return i + 1;
  }
  return values.length + 1;
}

// Run ONCE manually to create the header row
function setupHeaders() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  sheet.getRange(1, 1, 1, 9).setValues([[
    'Timestamp', 'IP Address', 'City', 'Region',
    'Country', 'Pincode', 'Page URL', 'Referrer', 'User Agent'
  ]]);
  sheet.getRange(1, 1, 1, 9)
    .setBackground('#1a73e8')
    .setFontColor('#ffffff')
    .setFontWeight('bold');
}
```

### Step D — Deploy

1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → copy the URL that ends in `/exec`
6. Paste it into your `.env.local` as `NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL`

### Step E — One-time setup

Back in the Apps Script editor, select `setupHeaders` from the function dropdown → click **Run**. This creates the styled header row in your sheet.

### Step F — Test the webhook

In your browser visit:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```
You should see `{"status":"OK"}`. That means the webhook is live.

---

## Columns in Google Sheet

| Col | Field | Example |
|-----|-------|---------|
| A | Timestamp (IST) | 27/04/2026, 02:30:15 PM (IST) |
| B | IP Address | 49.36.x.x |
| C | City | Mumbai |
| D | Region | Maharashtra |
| E | Country | India |
| F | Pincode | 400053 |
| G | Page URL | https://yoursite.com/ |
| H | Referrer | https://google.com (or "Direct") |
| I | User Agent | Mozilla/5.0 … |

---

## Deployment Checklist

- [ ] `src/hooks/useGeoLocation.ts` created
- [ ] `src/app/api/track-visitor/route.js` created
- [ ] `useEffect` tracking block added to the main page component
- [ ] `.env.local` has `NEXT_PUBLIC_VISITOR_TRACKING_WEBHOOK_URL` set
- [ ] Vercel environment variable added (Production + Preview)
- [ ] Apps Script created, `setupHeaders()` run once, deployed as Web App
- [ ] Webhook URL tested in browser (returns `{"status":"OK"}`)
- [ ] First test visit confirms a row appears in the sheet

---

## Limitations & Notes

| Topic | Detail |
|-------|--------|
| Free tier | ipapi.co allows 1,000 req/day free. For higher traffic use `ip-api.com` (45 req/min free) or `ipinfo.io` (50k/month free with API key). |
| Accuracy | IP geolocation is city-level accurate ~80% of the time. VPN users will show the VPN server location. |
| Privacy | No personal data beyond IP is collected. No cookies set. Compliant with most jurisdictions without a banner. For full GDPR compliance, anonymize the last octet of the IP. |
| Bot traffic | `userAgent` column will reveal bots (Googlebot, etc.) — filter these out in Sheets with `=FILTER(...)` if needed. |
| Duplicate visits | The system tracks every page load, not unique visitors. To deduplicate, check if the IP already exists in column B before writing. |
| Timezone | Change `+ 5.5 * 60 * 60 * 1000` to your offset, or replace `getIndianTime()` with `new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })` etc. |
