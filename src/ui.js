export const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sitemap Checker</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#127760;</text></svg>">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #000000;
    --bg-elevated: #1c1c1e;
    --bg-grouped: #2c2c2e;
    --bg-tertiary: #3a3a3c;
    --fill: rgba(120,120,128,.36);
    --separator: rgba(84,84,88,.65);
    --label-primary: #ffffff;
    --label-secondary: rgba(235,235,245,.6);
    --label-tertiary: rgba(235,235,245,.3);
    --label-quaternary: rgba(235,235,245,.18);
    --blue: #0a84ff;
    --green: #30d158;
    --red: #ff453a;
    --orange: #ff9f0a;
    --yellow: #ffd60a;
    --teal: #64d2ff;
    --purple: #bf5af2;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.3);
    --shadow-md: 0 4px 16px rgba(0,0,0,.4);
    --shadow-lg: 0 8px 32px rgba(0,0,0,.5);
    --transition: .25s cubic-bezier(.4,0,.2,1);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
    background: var(--bg);
    color: var(--label-primary);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Hero ── */
  .hero {
    text-align: center;
    padding: 80px 24px 48px;
    max-width: 680px;
    margin: 0 auto;
  }
  .hero-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    border-radius: var(--radius-lg);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 28px;
    box-shadow: 0 8px 24px rgba(10,132,255,.3);
  }
  .hero h1 {
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin-bottom: 12px;
    background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,.7) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero p {
    color: var(--label-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 480px;
    margin: 0 auto;
    font-weight: 400;
  }

  /* ── Search ── */
  .search-wrap {
    max-width: 640px;
    margin: 0 auto 56px;
    padding: 0 24px;
  }
  .search-box {
    display: flex;
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .search-box:focus-within {
    border-color: var(--blue);
    box-shadow: 0 0 0 4px rgba(10,132,255,.15);
  }
  .search-box input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 18px 20px;
    color: var(--label-primary);
    font-size: 1rem;
    font-family: inherit;
    outline: none;
  }
  .search-box input::placeholder { color: var(--label-tertiary); }
  .search-box button {
    background: var(--blue);
    border: none;
    color: #fff;
    padding: 18px 32px;
    font-size: .95rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background var(--transition);
    white-space: nowrap;
  }
  .search-box button:hover { background: #0070e0; }
  .search-box button:active { background: #005bb5; }
  .search-box button:disabled { opacity: .4; cursor: default; }

  /* ── Loader ── */
  .loader { display: none; text-align: center; padding: 80px 24px; }
  .loader.active { display: block; }
  .loader-ring {
    width: 44px; height: 44px;
    border: 3px solid var(--bg-grouped);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin .8s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loader p { color: var(--label-secondary); font-size: .95rem; }

  /* ── Error ── */
  .error-banner {
    display: none;
    max-width: 640px;
    margin: 0 auto 32px;
    padding: 16px 20px;
    background: rgba(255,69,58,.1);
    border: 1px solid rgba(255,69,58,.3);
    border-radius: var(--radius-md);
    color: var(--red);
    text-align: center;
    font-size: .9rem;
  }
  .error-banner.active { display: block; }

  /* ── Results ── */
  .results { display: none; max-width: 1440px; margin: 0 auto; padding: 0 24px 80px; }
  .results.active { display: block; }

  /* ── Stat Cards ── */
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
  }
  .card {
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    border-radius: var(--radius-md);
    padding: 20px 16px;
    text-align: center;
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .card .val {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--blue);
  }
  .card .val.green { color: var(--green); }
  .card .val.red { color: var(--red); }
  .card .val.orange { color: var(--orange); }
  .card .val.yellow { color: var(--yellow); }
  .card .lbl {
    color: var(--label-tertiary);
    font-size: .75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-top: 6px;
  }

  /* ── Sub-sitemaps Disclosure ── */
  .disclosure {
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    border-radius: var(--radius-md);
    margin-bottom: 28px;
    overflow: hidden;
  }
  .disclosure summary {
    padding: 16px 20px;
    font-size: .9rem;
    font-weight: 600;
    color: var(--label-secondary);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color var(--transition);
  }
  .disclosure summary:hover { color: var(--label-primary); }
  .disclosure summary::before {
    content: '\\25B8';
    font-size: .7rem;
    transition: transform var(--transition);
  }
  .disclosure[open] summary::before { transform: rotate(90deg); }
  .disclosure-body { padding: 0 20px 16px; }
  .disclosure-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--separator);
    font-size: .85rem;
  }
  .disclosure-row:last-child { border-bottom: none; }
  .disclosure-row a { color: var(--blue); text-decoration: none; word-break: break-all; }
  .disclosure-row a:hover { text-decoration: underline; }
  .disclosure-row .muted { color: var(--label-tertiary); white-space: nowrap; margin-left: 16px; font-variant-numeric: tabular-nums; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }
  .toolbar input, .toolbar select {
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    color: var(--label-primary);
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    font-size: .875rem;
    font-family: inherit;
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .toolbar input:focus, .toolbar select:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(10,132,255,.12);
  }
  .toolbar input { flex: 1; min-width: 200px; }
  .toolbar select { min-width: 160px; }
  .toolbar .meta {
    color: var(--label-tertiary);
    font-size: .8rem;
    margin-left: auto;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    padding: 10px 18px;
    border-radius: 980px;
    font-size: .85rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: filter var(--transition);
    white-space: nowrap;
  }
  .pill:hover { filter: brightness(1.1); }
  .pill:active { filter: brightness(.9); }
  .pill:disabled { opacity: .4; cursor: default; filter: none; }
  .pill-blue { background: var(--blue); color: #fff; }
  .pill-gray { background: var(--bg-grouped); color: var(--label-primary); }
  .pill-green { background: var(--green); color: #000; }

  /* ── Progress ── */
  .progress { display: none; margin-bottom: 24px; }
  .progress.active { display: block; }
  .progress-track { background: var(--bg-grouped); border-radius: 4px; height: 4px; overflow: hidden; }
  .progress-fill { background: var(--blue); height: 100%; width: 0%; transition: width .4s; border-radius: 4px; }
  .progress-text { color: var(--label-tertiary); font-size: .8rem; margin-top: 8px; text-align: right; font-variant-numeric: tabular-nums; }

  /* ── Table ── */
  .table-container {
    border: 1px solid var(--separator);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg-elevated); position: sticky; top: 0; z-index: 5; }
  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: .7rem;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--label-tertiary);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    border-bottom: 1px solid var(--separator);
    transition: color var(--transition);
  }
  th:hover { color: var(--label-secondary); }
  th .arr { font-size: .6rem; margin-left: 4px; opacity: .4; }
  th.sorted { color: var(--blue); }
  th.sorted .arr { opacity: 1; color: var(--blue); }
  td {
    padding: 11px 16px;
    font-size: .85rem;
    border-bottom: 1px solid rgba(84,84,88,.35);
    font-variant-numeric: tabular-nums;
  }
  tbody tr { background: var(--bg); transition: background var(--transition); }
  tbody tr:hover { background: var(--bg-elevated); }
  .url-col { max-width: 480px; word-break: break-all; }
  .url-col a { color: var(--blue); text-decoration: none; }
  .url-col a:hover { text-decoration: underline; }

  .tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: .72rem;
    font-weight: 600;
    letter-spacing: .02em;
  }
  .tag-source { background: rgba(10,132,255,.12); color: var(--teal); }
  .tag-lang { background: rgba(48,209,88,.1); color: var(--green); margin: 1px 3px; }

  .status-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 980px;
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .02em;
  }
  .st-ok { background: rgba(48,209,88,.12); color: var(--green); }
  .st-redirect { background: rgba(255,214,10,.1); color: var(--yellow); }
  .st-client { background: rgba(255,69,58,.1); color: var(--red); }
  .st-server { background: rgba(255,159,10,.1); color: var(--orange); }
  .st-err { background: var(--bg-grouped); color: var(--label-tertiary); }
  .st-pending { color: var(--label-quaternary); font-size: .8rem; }

  .empty td { text-align: center; padding: 48px 16px; color: var(--label-tertiary); }

  /* ── Footer ── */
  .footer {
    text-align: center;
    padding: 40px 24px;
    color: var(--label-quaternary);
    font-size: .8rem;
  }
  .footer a { color: var(--label-tertiary); text-decoration: none; transition: color var(--transition); }
  .footer a:hover { color: var(--label-secondary); }

  @media (max-width: 768px) {
    .hero { padding: 48px 20px 32px; }
    .hero h1 { font-size: 2rem; }
    .hero p { font-size: .95rem; }
    .cards { grid-template-columns: repeat(3, 1fr); }
    .card .val { font-size: 1.5rem; }
    td, th { padding: 8px 12px; font-size: .8rem; }
  }
  @media (max-width: 480px) {
    .cards { grid-template-columns: repeat(2, 1fr); }
    .toolbar { gap: 8px; }
  }
</style>
</head>
<body>

<!-- Hero -->
<section class="hero">
  <div class="hero-icon">&#127760;</div>
  <h1>Sitemap Checker</h1>
  <p>Crawl any XML sitemap, discover every URL across all sub-sitemaps, and verify HTTP status codes in real time.</p>
</section>

<!-- Search -->
<div class="search-wrap">
  <div class="search-box">
    <input type="text" id="urlInput" placeholder="Enter sitemap URL..." autofocus>
    <button id="crawlBtn" onclick="startCrawl()">Analyze</button>
  </div>
</div>

<!-- Error -->
<div class="error-banner" id="error"></div>

<!-- Loader -->
<div class="loader" id="loader">
  <div class="loader-ring"></div>
  <p id="loaderText">Crawling sitemap...</p>
</div>

<!-- Results -->
<div class="results" id="results">

  <!-- Stats -->
  <div class="cards" id="cards"></div>

  <!-- Sub-sitemaps -->
  <details class="disclosure" id="sitemapsPanel" style="display:none">
    <summary id="sitemapsSummary"></summary>
    <div class="disclosure-body" id="sitemapsBody"></div>
  </details>

  <!-- Progress -->
  <div class="progress" id="progress">
    <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText"></div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <input type="text" id="filterInput" placeholder="Filter URLs..." oninput="applyFilters()">
    <select id="sourceSelect" onchange="applyFilters()"><option value="">All Sources</option></select>
    <select id="statusSelect" onchange="applyFilters()">
      <option value="">All Status</option>
      <option value="ok">200 OK</option>
      <option value="redirect">3xx Redirect</option>
      <option value="client">4xx Error</option>
      <option value="server">5xx Error</option>
      <option value="error">Conn Error</option>
      <option value="pending">Not Checked</option>
    </select>
    <button class="pill pill-green" id="statusBtn" onclick="checkAllStatus()">Check Status</button>
    <button class="pill pill-gray" onclick="copyUrls()">Copy URLs</button>
    <button class="pill pill-blue" onclick="exportCSV()">Export CSV</button>
    <span class="meta" id="countLabel"></span>
  </div>

  <!-- Table -->
  <div class="table-container">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th onclick="sortBy(0)"># <span class="arr"></span></th>
            <th onclick="sortBy(1)">URL <span class="arr"></span></th>
            <th onclick="sortBy(2)">Status <span class="arr"></span></th>
            <th onclick="sortBy(3)">Source <span class="arr"></span></th>
            <th onclick="sortBy(4)">Last Modified <span class="arr"></span></th>
            <th onclick="sortBy(5)">Priority <span class="arr"></span></th>
            <th onclick="sortBy(6)">Images <span class="arr"></span></th>
            <th onclick="sortBy(7)">Hreflang <span class="arr"></span></th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- Footer -->
<div class="footer">
  Built with Cloudflare Workers &middot; <a href="https://github.com/aliarifsoydas/sitemap-checker" target="_blank">Source on GitHub</a>
</div>

<script>
let DATA = [], statusMap = {}, sortCol = -1, sortAsc = true;
const $ = id => document.getElementById(id);

$('urlInput').addEventListener('keydown', e => { if (e.key === 'Enter') startCrawl(); });

/* ── Crawl ── */
async function startCrawl() {
  const url = $('urlInput').value.trim();
  if (!url) return;
  hide('error'); hide('results'); hide('progress');
  show('loader');
  $('crawlBtn').disabled = true;
  statusMap = {};
  try {
    const r = await fetch('/api/crawl', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url}) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Request failed');
    DATA = j.entries;
    renderResults(j);
  } catch(e) {
    $('error').textContent = e.message;
    show('error');
  } finally {
    hide('loader');
    $('crawlBtn').disabled = false;
  }
}

/* ── Status Badge ── */
function stBadge(url) {
  const s = statusMap[url];
  if (s === undefined) return '<span class="st-pending">&mdash;</span>';
  if (s === 0)             return '<span class="status-pill st-err">ERR</span>';
  if (s >= 200 && s < 300) return '<span class="status-pill st-ok">'+s+'</span>';
  if (s >= 300 && s < 400) return '<span class="status-pill st-redirect">'+s+'</span>';
  if (s >= 400 && s < 500) return '<span class="status-pill st-client">'+s+'</span>';
  return '<span class="status-pill st-server">'+s+'</span>';
}

function stCat(url) {
  const s = statusMap[url];
  if (s === undefined) return 'pending';
  if (s === 0) return 'error';
  if (s >= 200 && s < 300) return 'ok';
  if (s >= 300 && s < 400) return 'redirect';
  if (s >= 400 && s < 500) return 'client';
  return 'server';
}

/* ── Status Check ── */
async function checkAllStatus() {
  const btn = $('statusBtn');
  btn.disabled = true; btn.textContent = 'Checking...';
  show('progress');
  const urls = DATA.map(e => e.url);
  const batch = 30;
  let done = 0;
  for (let i = 0; i < urls.length; i += batch) {
    const chunk = urls.slice(i, i + batch);
    try {
      const r = await fetch('/api/check-status', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({urls:chunk}) });
      const j = await r.json();
      if (j.results) j.results.forEach(x => { statusMap[x.url] = x.status; });
    } catch(_) { chunk.forEach(u => { if (!(u in statusMap)) statusMap[u] = 0; }); }
    done += chunk.length;
    $('progressFill').style.width = Math.min(100, Math.round(done/urls.length*100)) + '%';
    $('progressText').textContent = done + ' / ' + urls.length;
    renderTable(getFiltered());
    updateCards();
  }
  btn.disabled = false; btn.textContent = 'Check Status';
  setTimeout(() => hide('progress'), 2000);
}

/* ── Cards ── */
function updateCards() {
  const t = DATA.length;
  let ok=0, re=0, cl=0, sv=0, er=0;
  Object.values(statusMap).forEach(s => {
    if (s>=200&&s<300) ok++;
    else if (s>=300&&s<400) re++;
    else if (s>=400&&s<500) cl++;
    else if (s>=500) sv++;
    else er++;
  });
  $('cards').innerHTML =
    card(t,'','Total URLs') +
    card(ok,'green','200 OK') +
    card(re,'yellow','3xx Redirect') +
    card(cl,'red','4xx Error') +
    card(sv,'orange','5xx Error') +
    card(er,'','Conn Error');
}

function card(v,c,l) { return '<div class="card"><div class="val'+(c?' '+c:'')+'">'+v+'</div><div class="lbl">'+l+'</div></div>'; }

/* ── Render ── */
function renderResults(json) {
  const { entries, sitemaps } = json;
  const src = {};
  entries.forEach(e => { src[e.source] = (src[e.source]||0) + 1; });

  $('cards').innerHTML =
    card(entries.length,'','Total URLs') +
    card(sitemaps.length,'','Sub-Sitemaps') +
    card(Object.keys(src).length,'','Sources') +
    card(entries.filter(e=>e.images>0).length,'','With Images') +
    card(entries.filter(e=>e.hreflangs&&e.hreflangs.length).length,'','Hreflang');

  if (sitemaps.length) {
    $('sitemapsPanel').style.display = '';
    $('sitemapsSummary').textContent = sitemaps.length + ' Sub-Sitemaps';
    $('sitemapsBody').innerHTML = sitemaps.map(s =>
      '<div class="disclosure-row"><a href="'+s.url+'" target="_blank">'+s.url+'</a><span class="muted">'+s.lastmod+'</span></div>'
    ).join('');
  } else {
    $('sitemapsPanel').style.display = 'none';
  }

  $('sourceSelect').innerHTML = '<option value="">All Sources</option>' +
    Object.entries(src).map(kv => '<option value="'+kv[0]+'">'+kv[0]+' ('+kv[1]+')</option>').join('');

  $('filterInput').value = ''; $('statusSelect').value = '';
  sortCol = -1;
  renderTable(entries);
  show('results');
}

function getFiltered() {
  const q = $('filterInput').value.toLowerCase();
  const src = $('sourceSelect').value;
  const st = $('statusSelect').value;
  return DATA.filter(e => {
    if (q && !e.url.toLowerCase().includes(q)) return false;
    if (src && e.source !== src) return false;
    if (st && stCat(e.url) !== st) return false;
    return true;
  });
}

function applyFilters() { renderTable(getFiltered()); }

function sortBy(col) {
  if (sortCol === col) sortAsc = !sortAsc;
  else { sortCol = col; sortAsc = true; }
  const keys = [null,'url','_st','source','lastmod','priority','images','hreflangs'];
  const key = keys[col];
  if (!key) return;
  const data = getFiltered();
  data.sort((a,b) => {
    let va, vb;
    if (key==='_st') { va=statusMap[a.url]||999; vb=statusMap[b.url]||999; }
    else if (key==='images') { va=a.images; vb=b.images; }
    else if (key==='hreflangs') { va=(a.hreflangs||[]).length; vb=(b.hreflangs||[]).length; }
    else { va=a[key]||''; vb=b[key]||''; }
    if (typeof va==='number') return sortAsc?va-vb:vb-va;
    return sortAsc?String(va).localeCompare(String(vb)):String(vb).localeCompare(String(va));
  });
  document.querySelectorAll('th').forEach((th,i) => {
    th.classList.toggle('sorted',i===col);
    const a = th.querySelector('.arr');
    if(a) a.textContent = i===col?(sortAsc?'\\u25B2':'\\u25BC'):'';
  });
  renderTable(data);
}

function renderTable(data) {
  const tb = $('tbody');
  if (!data.length) {
    tb.innerHTML = '<tr class="empty"><td colspan="8">No URLs found</td></tr>';
    $('countLabel').textContent = '0 / '+DATA.length;
    return;
  }
  tb.innerHTML = data.map((e,i) => {
    const langs = (e.hreflangs||[]).map(h => '<span class="tag tag-lang">'+h.lang+'</span>').join('');
    return '<tr>'+
      '<td>'+(i+1)+'</td>'+
      '<td class="url-col"><a href="'+e.url+'" target="_blank">'+e.url+'</a></td>'+
      '<td>'+stBadge(e.url)+'</td>'+
      '<td><span class="tag tag-source">'+e.source+'</span></td>'+
      '<td>'+(e.lastmod!=='-'?e.lastmod.substring(0,10):'-')+'</td>'+
      '<td>'+e.priority+'</td>'+
      '<td>'+(e.images>0?e.images:'-')+'</td>'+
      '<td>'+(langs||'-')+'</td>'+
    '</tr>';
  }).join('');
  $('countLabel').textContent = data.length+' / '+DATA.length+' URLs';
}

/* ── Actions ── */
function copyUrls() {
  const urls = getFiltered().map(e=>e.url).join('\\n');
  navigator.clipboard.writeText(urls).then(() => {
    const b = document.querySelectorAll('.pill-gray')[0];
    const o = b.textContent; b.textContent = 'Copied!';
    setTimeout(()=>b.textContent=o, 1200);
  });
}

function exportCSV() {
  const rows = [['URL','Status','Source','Last Modified','Changefreq','Priority','Images','Hreflang']];
  getFiltered().forEach(e => {
    rows.push([e.url, statusMap[e.url]!==undefined?statusMap[e.url]:'', e.source, e.lastmod, e.changefreq, e.priority, e.images,
      (e.hreflangs||[]).map(h=>h.lang).join(';')]);
  });
  const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\\n');
  const blob = new Blob(['\\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap_urls.csv';
  a.click();
}

/* ── Helpers ── */
function show(id) { $(id).classList.add('active'); }
function hide(id) { $(id).classList.remove('active'); }
</script>
</body>
</html>`;
