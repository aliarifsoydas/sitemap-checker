# Sitemap Checker

A fast, modern sitemap analysis tool that runs on [Cloudflare Workers](https://workers.cloudflare.com). Paste any URL — a sitemap.xml, a homepage, or just a bare domain — and it will automatically discover sitemaps, crawl all sub-sitemaps, list every URL in a sortable table, and batch-check HTTP status codes in real time.

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Features

### Auto-Discovery
You don't need to know where the sitemap lives. Just enter `example.com` and the tool will:
1. Check if the URL itself returns XML
2. Parse the homepage HTML for `<link rel="sitemap">` tags
3. Fetch `/robots.txt` and read `Sitemap:` directives
4. Try common paths: `/sitemap.xml`, `/wp-sitemap.xml`, `/sitemap_index.xml`, etc.

### Sitemap Crawling
- Recursively resolves **sitemap index** files and all nested sub-sitemaps (up to 3 levels deep)
- Extracts `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>` from every `<url>` entry
- Detects `<image:image>` count per URL
- Parses `<xhtml:link rel="alternate" hreflang="...">` tags for multilingual sites

### HTTP Status Checking
- Batch-checks every URL's HTTP response code (200, 301, 404, 500, etc.)
- Sends `HEAD` requests first, falls back to `GET` if HEAD is blocked
- Processes URLs in parallel batches of 10 for speed
- Live progress bar and real-time table updates as results stream in

### Table & Filters
- **Search** — filter URLs by keyword
- **Source filter** — narrow down by originating sitemap file
- **Status filter** — show only 200 OK, 3xx redirects, 4xx/5xx errors, or connection failures
- **Column sorting** — click any header to sort ascending/descending
- **Copy URLs** — one-click copy all visible URLs to clipboard
- **Export CSV** — download filtered results as a CSV file with BOM for Excel compatibility

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)

### Install

```bash
git clone https://github.com/aliarifsoydas/sitemap-checker.git
cd sitemap-checker
npm install
```

### Local Development

```bash
npm run dev
```

Opens a local dev server at `http://localhost:8787`. Changes to `src/` are picked up automatically.

### Deploy to Cloudflare

```bash
npx wrangler login   # one-time auth
npm run deploy
```

Your worker will be live at `https://sitemap-checker.<your-subdomain>.workers.dev`.

#### Custom Domain

To use your own domain, add a route in `wrangler.toml`:

```toml
routes = [
  { pattern = "sitemap.yourdomain.com", custom_domain = true }
]
```

Then run `npm run deploy` again.

---

## Project Structure

```
sitemap-checker/
├── src/
│   ├── index.js    # Worker entry: API routes + sitemap parser + status checker
│   └── ui.js       # Frontend HTML/CSS/JS served as a single inline page
├── wrangler.toml   # Cloudflare Worker configuration
├── package.json
└── README.md
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Serves the frontend UI |
| `POST` | `/api/crawl` | Crawls a sitemap URL and returns all entries as JSON |
| `POST` | `/api/check-status` | Batch-checks HTTP status codes for a list of URLs |

#### `POST /api/crawl`

**Request:**
```json
{
  "url": "https://example.com/sitemap.xml"
}
```

**Response:**
```json
{
  "entries": [
    {
      "url": "https://example.com/page",
      "source": "sitemap-pages.xml",
      "lastmod": "2025-01-15",
      "changefreq": "weekly",
      "priority": "0.8",
      "images": 2,
      "hreflangs": [
        { "lang": "en", "href": "https://example.com/page" },
        { "lang": "tr", "href": "https://example.com/tr/page" }
      ]
    }
  ],
  "sitemaps": [
    { "url": "https://example.com/sitemap-pages.xml", "lastmod": "2025-01-15" }
  ],
  "total": 150
}
```

#### `POST /api/check-status`

**Request:**
```json
{
  "urls": [
    "https://example.com/page-1",
    "https://example.com/page-2"
  ]
}
```

**Response:**
```json
{
  "results": [
    { "url": "https://example.com/page-1", "status": 200 },
    { "url": "https://example.com/page-2", "status": 404 }
  ]
}
```

---

## How It Works

```
User enters any URL (homepage, domain, or sitemap.xml)
        │
        ▼
  ┌─────────────┐
  │  /api/crawl  │
  └──────┬──────┘
         │
         ▼
  ┌──────────────────┐
  │ discoverSitemaps  │  Is it XML? Check <link> tags?
  │                   │  Parse robots.txt? Try common paths?
  └────────┬─────────┘
           │ returns sitemap URL(s)
           ▼
  For each discovered sitemap:
         │
         ▼
  Is it a <sitemapindex>?
     ┌────┴────┐
    Yes        No
     │          │
     ▼          ▼
  Recursively   Parse <url> entries
  fetch each    (loc, lastmod, priority,
  sub-sitemap    images, hreflang)
     │          │
     └────┬─────┘
          ▼
   Return all entries + discovery info
          │
          ▼
   Frontend renders table
          │
          ▼
   User clicks "Check Status"
          │
          ▼
  ┌────────────────────┐
  │  /api/check-status  │  HEAD requests in batches of 10
  └────────┬───────────┘
           ▼
   Status updates in real time
```

---

## Limits & Notes

- **Cloudflare Workers** has a CPU time limit of 30 seconds per request on the free plan. Very large sitemaps (10,000+ URLs) may need the paid Workers plan or batched crawling.
- **Subrequest limit** is 1,000 per invocation on the free plan. The status checker batches 30 URLs per API call to stay within this.
- Status checking uses the Worker's IP, so results may differ from your browser's perspective (geo-routing, IP-based blocks, etc.).
- Some servers block `HEAD` requests — the tool automatically falls back to `GET`.

---

## License

MIT
