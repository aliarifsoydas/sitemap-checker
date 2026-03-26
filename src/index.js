import { html } from "./ui.js";

// ── XML Parsing helpers (no DOM parser in Workers) ──────────────────────────

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const matches = [];
  let m;
  while ((m = re.exec(xml)) !== null) matches.push(m[1].trim());
  return matches;
}

function extractFirst(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

function extractAttr(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1] : null;
}

function extractXhtmlLinks(urlBlock) {
  const re = /<xhtml:link[^>]*>/gi;
  const links = [];
  let m;
  while ((m = re.exec(urlBlock)) !== null) {
    const tag = m[0];
    const rel = tag.match(/rel="([^"]*)"/i);
    const lang = tag.match(/hreflang="([^"]*)"/i);
    const href = tag.match(/href="([^"]*)"/i);
    if (rel && rel[1] === "alternate" && lang && href) {
      links.push({ lang: lang[1], href: href[1] });
    }
  }
  return links;
}

function countImages(urlBlock) {
  return (urlBlock.match(/<image:image[\s>]/gi) || []).length;
}

function basename(url) {
  try {
    const path = new URL(url).pathname;
    return path.split("/").filter(Boolean).pop() || url;
  } catch {
    return url;
  }
}

// ── Sitemap fetching & parsing ──────────────────────────────────────────────

async function fetchXml(url) {
  const resp = await fetch(url, {
    headers: { "User-Agent": "SitemapChecker/1.0" },
    redirect: "follow",
  });
  if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
  return await resp.text();
}

async function parseSitemap(url, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return { entries: [], sitemaps: [] };

  const xml = await fetchXml(url);
  const isSitemapIndex = /<sitemapindex[\s>]/i.test(xml);

  let entries = [];
  let sitemaps = [];

  if (isSitemapIndex) {
    const blocks = extractTag(xml, "sitemap");
    for (const block of blocks) {
      const loc = extractFirst(block, "loc");
      const lastmod = extractFirst(block, "lastmod") || "-";
      if (!loc) continue;
      sitemaps.push({ url: loc, lastmod });
      const sub = await parseSitemap(loc, depth + 1, maxDepth);
      entries = entries.concat(sub.entries);
      sitemaps = sitemaps.concat(sub.sitemaps);
    }
    return { entries, sitemaps };
  }

  // Regular sitemap
  const urlBlocks = extractTag(xml, "url");
  const source = basename(url);

  for (const block of urlBlocks) {
    const loc = extractFirst(block, "loc");
    if (!loc) continue;
    entries.push({
      url: loc,
      source,
      lastmod: extractFirst(block, "lastmod") || "-",
      changefreq: extractFirst(block, "changefreq") || "-",
      priority: extractFirst(block, "priority") || "-",
      images: countImages(block),
      hreflangs: extractXhtmlLinks(block),
    });
  }

  return { entries, sitemaps };
}

// ── URL status checker ──────────────────────────────────────────────────────

async function checkUrlStatus(url) {
  try {
    const resp = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "SitemapChecker/1.0" },
      redirect: "follow",
    });
    return { url, status: resp.status };
  } catch {
    try {
      const resp = await fetch(url, {
        headers: { "User-Agent": "SitemapChecker/1.0" },
        redirect: "follow",
      });
      return { url, status: resp.status };
    } catch (e) {
      return { url, status: 0, error: e.message };
    }
  }
}

// ── Worker entry ────────────────────────────────────────────────────────────

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ── API: Crawl sitemap ──
    if (url.pathname === "/api/crawl" && request.method === "POST") {
      try {
        const body = await request.json();
        let targetUrl = (body.url || "").trim();
        if (!targetUrl) {
          return Response.json({ error: "URL is required" }, { status: 400, headers: corsHeaders });
        }
        if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

        const { entries, sitemaps } = await parseSitemap(targetUrl);
        return Response.json({ entries, sitemaps, total: entries.length }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
      }
    }

    // ── API: Check status codes (batch) ──
    if (url.pathname === "/api/check-status" && request.method === "POST") {
      try {
        const body = await request.json();
        const urls = body.urls || [];
        if (!urls.length) {
          return Response.json({ error: "URL list is required" }, { status: 400, headers: corsHeaders });
        }

        // Process in batches of 10 for concurrency
        const batchSize = 10;
        const results = [];
        for (let i = 0; i < urls.length; i += batchSize) {
          const batch = urls.slice(i, i + batchSize);
          const batchResults = await Promise.all(batch.map(checkUrlStatus));
          results.push(...batchResults);
        }

        return Response.json({ results }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
      }
    }

    // ── Serve frontend ──
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
