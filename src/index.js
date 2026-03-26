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

async function fetchText(url) {
  const resp = await fetch(url, {
    headers: { "User-Agent": "SitemapChecker/1.0" },
    redirect: "follow",
  });
  if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
  return await resp.text();
}

function looksLikeXml(text) {
  const trimmed = text.trimStart().substring(0, 200);
  return trimmed.startsWith("<?xml") || /<(urlset|sitemapindex)[\s>]/i.test(trimmed);
}

// ── Sitemap discovery from any URL ──────────────────────────────────────────

async function discoverSitemaps(inputUrl) {
  const origin = new URL(inputUrl).origin;
  const found = [];

  // 1. Check if the URL itself is already XML
  try {
    const text = await fetchText(inputUrl);
    if (looksLikeXml(text)) return [inputUrl];
  } catch {}

  // 2. Parse HTML for <link rel="sitemap"> tags
  try {
    const html = await fetchText(inputUrl);
    const linkRe = /<link[^>]*rel=["']sitemap["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      const href = m[0].match(/href=["']([^"']+)["']/i);
      if (href) {
        const resolved = href[1].startsWith("http") ? href[1] : origin + (href[1].startsWith("/") ? "" : "/") + href[1];
        found.push(resolved);
      }
    }
  } catch {}

  // 3. Parse robots.txt for Sitemap: directives
  try {
    const robots = await fetchText(origin + "/robots.txt");
    const lines = robots.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*sitemap:\s*(.+)/i);
      if (match) found.push(match[1].trim());
    }
  } catch {}

  // 4. Try common sitemap paths
  const commonPaths = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap.xml",
    "/wp-sitemap.xml",
    "/sitemap/",
    "/sitemaps/sitemap.xml",
  ];

  // Deduplicate what we already found before brute-forcing
  const seen = new Set(found.map((u) => u.toLowerCase()));

  for (const path of commonPaths) {
    const candidate = origin + path;
    if (seen.has(candidate.toLowerCase())) continue;
    try {
      const text = await fetchText(candidate);
      if (looksLikeXml(text)) {
        found.push(candidate);
        break; // one hit is enough from guessing
      }
    } catch {}
  }

  if (!found.length) {
    throw new Error(
      "No sitemap found. Checked HTML <link> tags, robots.txt, and common paths like /sitemap.xml"
    );
  }

  // Deduplicate
  return [...new Set(found)];
}

async function parseSitemap(url, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return { entries: [], sitemaps: [] };

  let xml;
  try {
    xml = await fetchText(url);
  } catch {
    return { entries: [], sitemaps: [] };
  }
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

        // Discover sitemaps if URL doesn't look like an XML file
        const sitemapUrls = await discoverSitemaps(targetUrl);

        // Crawl all discovered sitemaps and merge results
        let allEntries = [];
        let allSitemaps = [];
        for (const smUrl of sitemapUrls) {
          const { entries, sitemaps } = await parseSitemap(smUrl);
          allEntries = allEntries.concat(entries);
          allSitemaps = allSitemaps.concat(sitemaps);
        }

        // Add root-level discovered sitemaps to the list if they aren't already there
        const knownUrls = new Set(allSitemaps.map((s) => s.url));
        for (const smUrl of sitemapUrls) {
          if (!knownUrls.has(smUrl)) {
            allSitemaps.unshift({ url: smUrl, lastmod: "-", discovered: true });
          }
        }

        return Response.json(
          { entries: allEntries, sitemaps: allSitemaps, total: allEntries.length, discoveredFrom: sitemapUrls },
          { headers: corsHeaders }
        );
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
