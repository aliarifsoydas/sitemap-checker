export const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sitemap Checker</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0a0f1a;color:#e2e8f0;min-height:100vh}

  .hero{text-align:center;padding:60px 20px 40px}
  .hero h1{font-size:2.4rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:10px}
  .hero p{color:#64748b;font-size:1.05rem;max-width:520px;margin:0 auto}

  .search-box{max-width:700px;margin:0 auto 40px;padding:0 20px}
  .input-group{display:flex;background:#1e293b;border:2px solid #334155;border-radius:14px;overflow:hidden;transition:border-color .2s}
  .input-group:focus-within{border-color:#38bdf8}
  .input-group input{flex:1;background:transparent;border:none;padding:16px 20px;color:#f1f5f9;font-size:1rem;outline:none}
  .input-group input::placeholder{color:#475569}
  .input-group button{background:linear-gradient(135deg,#2563eb,#7c3aed);border:none;color:#fff;padding:16px 28px;font-size:.95rem;font-weight:600;cursor:pointer;transition:opacity .2s;white-space:nowrap}
  .input-group button:hover{opacity:.9}
  .input-group button:disabled{opacity:.5;cursor:wait}

  .loader{display:none;text-align:center;padding:60px 20px}
  .loader.active{display:block}
  .spinner{width:40px;height:40px;border:4px solid #1e293b;border-top-color:#38bdf8;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loader p{color:#64748b}

  .error{display:none;max-width:700px;margin:0 auto 30px;padding:14px 20px;background:#1c1017;border:1px solid #7f1d1d;border-radius:10px;color:#fca5a5;text-align:center}
  .error.active{display:block}

  .results{display:none;max-width:1500px;margin:0 auto;padding:0 20px 60px}
  .results.active{display:block}

  .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:24px}
  .stat{background:#1e293b;border:1px solid #293548;border-radius:12px;padding:18px;text-align:center}
  .stat .num{font-size:2rem;font-weight:700;color:#38bdf8;line-height:1.1}
  .stat .label{color:#64748b;font-size:.8rem;margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
  .stat .num.green{color:#34d399}
  .stat .num.red{color:#f87171}
  .stat .num.yellow{color:#fbbf24}

  .sitemaps-panel{background:#1e293b;border:1px solid #293548;border-radius:12px;padding:18px;margin-bottom:24px}
  .sitemaps-panel h3{font-size:.95rem;color:#94a3b8;margin-bottom:12px}
  .sitemaps-panel .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #293548;font-size:.85rem}
  .sitemaps-panel .row:last-child{border:none}
  .sitemaps-panel a{color:#38bdf8;text-decoration:none;word-break:break-all}
  .sitemaps-panel a:hover{text-decoration:underline}
  .sitemaps-panel .date{color:#475569;white-space:nowrap;margin-left:12px}

  .toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
  .toolbar input,.toolbar select{background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:10px 14px;border-radius:8px;font-size:.9rem;outline:none;transition:border-color .2s}
  .toolbar input:focus,.toolbar select:focus{border-color:#38bdf8}
  .toolbar input{flex:1;min-width:200px}
  .toolbar select{min-width:170px}
  .toolbar .meta{color:#475569;font-size:.8rem;margin-left:auto;white-space:nowrap}
  .btn{border:none;padding:10px 16px;border-radius:8px;font-size:.85rem;font-weight:500;cursor:pointer;transition:opacity .2s;white-space:nowrap}
  .btn:hover{opacity:.85}
  .btn:disabled{opacity:.5;cursor:wait}
  .btn-primary{background:#2563eb;color:#fff}
  .btn-secondary{background:#334155;color:#e2e8f0}
  .btn-status{background:linear-gradient(135deg,#059669,#0d9488);color:#fff}

  .progress-bar{display:none;max-width:1500px;margin:0 auto 16px;padding:0 20px}
  .progress-bar.active{display:block}
  .progress-track{background:#1e293b;border-radius:8px;height:8px;overflow:hidden}
  .progress-fill{background:linear-gradient(90deg,#38bdf8,#818cf8);height:100%;width:0%;transition:width .3s;border-radius:8px}
  .progress-label{color:#64748b;font-size:.8rem;margin-top:6px;text-align:center}

  .table-wrap{overflow-x:auto;border-radius:12px;border:1px solid #293548}
  table{width:100%;border-collapse:collapse}
  thead{background:#1e293b;position:sticky;top:0;z-index:5}
  th{padding:12px 14px;text-align:left;font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.5px;color:#64748b;cursor:pointer;user-select:none;white-space:nowrap;border-bottom:2px solid #293548}
  th:hover{color:#94a3b8}
  th .arr{font-size:.65rem;margin-left:3px;opacity:.5}
  th.sorted .arr{opacity:1;color:#38bdf8}
  td{padding:10px 14px;font-size:.85rem;border-bottom:1px solid #1a2332}
  tr{background:#0f172a}
  tr:hover{background:#162032}
  .url-cell{max-width:480px;word-break:break-all}
  .url-cell a{color:#38bdf8;text-decoration:none}
  .url-cell a:hover{text-decoration:underline}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.72rem;font-weight:500}
  .badge-src{background:#1a2744;color:#7dd3fc}
  .badge-lang{background:#122b1e;color:#6ee7b7;margin:1px 2px}
  .badge-status{padding:3px 10px;border-radius:6px;font-weight:600;font-size:.78rem}
  .status-ok{background:#052e16;color:#34d399}
  .status-redirect{background:#1a1700;color:#fbbf24}
  .status-client{background:#1c0a0a;color:#f87171}
  .status-server{background:#1c0a0a;color:#fb923c}
  .status-err{background:#1a1a1a;color:#6b7280}
  .status-pending{color:#475569}
  .empty-row td{text-align:center;padding:40px;color:#475569}

  .footer{text-align:center;padding:30px;color:#334155;font-size:.8rem}
  .footer a{color:#475569;text-decoration:none}
  .footer a:hover{color:#64748b}

  @media(max-width:768px){
    .hero h1{font-size:1.6rem}.hero{padding:40px 20px 24px}
    .stat .num{font-size:1.4rem}
    td,th{padding:8px 10px;font-size:.8rem}
  }
</style>
</head>
<body>

<div class="hero">
  <h1>Sitemap Checker</h1>
  <p>Enter any sitemap URL to crawl all sub-sitemaps, list every URL, and check HTTP status codes.</p>
</div>

<div class="search-box">
  <div class="input-group">
    <input type="text" id="urlInput" placeholder="https://example.com/sitemap.xml" autofocus>
    <button id="crawlBtn" onclick="startCrawl()">Crawl</button>
  </div>
</div>

<div class="error" id="error"></div>

<div class="loader" id="loader">
  <div class="spinner"></div>
  <p id="loaderText">Crawling sitemap and all sub-sitemaps...</p>
</div>

<div class="progress-bar" id="progressBar">
  <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
  <div class="progress-label" id="progressLabel"></div>
</div>

<div class="results" id="results">
  <div class="stats" id="stats"></div>
  <div class="sitemaps-panel" id="sitemapsPanel" style="display:none"></div>

  <div class="toolbar">
    <input type="text" id="filterInput" placeholder="Filter URLs..." oninput="applyFilters()">
    <select id="sourceSelect" onchange="applyFilters()"><option value="">All Sources</option></select>
    <select id="statusSelect" onchange="applyFilters()">
      <option value="">All Status</option>
      <option value="ok">200 OK</option>
      <option value="redirect">3xx Redirect</option>
      <option value="client">4xx Client Error</option>
      <option value="server">5xx Server Error</option>
      <option value="error">Connection Error</option>
      <option value="pending">Not Checked</option>
    </select>
    <button class="btn btn-status" id="statusBtn" onclick="checkAllStatus()">Check Status</button>
    <button class="btn btn-secondary" onclick="copyUrls()">Copy URLs</button>
    <button class="btn btn-primary" onclick="exportCSV()">Export CSV</button>
    <span class="meta" id="countLabel"></span>
  </div>

  <div class="table-wrap">
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

<div class="footer">
  <a href="https://github.com/aliarifsoydas/sitemap-checker" target="_blank">GitHub</a>
</div>

<script>
let DATA = [];
let statusMap = {};
let sortCol = -1, sortAsc = true;

const $ = id => document.getElementById(id);

$('urlInput').addEventListener('keydown', e => { if (e.key === 'Enter') startCrawl(); });

async function startCrawl() {
  const url = $('urlInput').value.trim();
  if (!url) return;

  $('error').classList.remove('active');
  $('results').classList.remove('active');
  $('progressBar').classList.remove('active');
  $('loader').classList.add('active');
  $('loaderText').textContent = 'Crawling sitemap and all sub-sitemaps...';
  $('crawlBtn').disabled = true;
  statusMap = {};

  try {
    const resp = await fetch('/api/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || 'Unknown error');
    DATA = json.entries;
    renderResults(json);
  } catch (e) {
    $('error').textContent = e.message;
    $('error').classList.add('active');
  } finally {
    $('loader').classList.remove('active');
    $('crawlBtn').disabled = false;
  }
}

function statusBadge(url) {
  const s = statusMap[url];
  if (s === undefined) return '<span class="status-pending">-</span>';
  if (s === 0) return '<span class="badge badge-status status-err">ERR</span>';
  if (s >= 200 && s < 300) return '<span class="badge badge-status status-ok">' + s + '</span>';
  if (s >= 300 && s < 400) return '<span class="badge badge-status status-redirect">' + s + '</span>';
  if (s >= 400 && s < 500) return '<span class="badge badge-status status-client">' + s + '</span>';
  return '<span class="badge badge-status status-server">' + s + '</span>';
}

function statusCategory(url) {
  const s = statusMap[url];
  if (s === undefined) return 'pending';
  if (s === 0) return 'error';
  if (s >= 200 && s < 300) return 'ok';
  if (s >= 300 && s < 400) return 'redirect';
  if (s >= 400 && s < 500) return 'client';
  return 'server';
}

async function checkAllStatus() {
  const btn = $('statusBtn');
  btn.disabled = true;
  btn.textContent = 'Checking...';
  $('progressBar').classList.add('active');

  const urls = DATA.map(e => e.url);
  const batchSize = 30;
  let done = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    try {
      const resp = await fetch('/api/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: batch }),
      });
      const json = await resp.json();
      if (json.results) {
        json.results.forEach(r => { statusMap[r.url] = r.status; });
      }
    } catch (e) {
      batch.forEach(u => { if (!(u in statusMap)) statusMap[u] = 0; });
    }
    done += batch.length;
    const pct = Math.min(100, Math.round((done / urls.length) * 100));
    $('progressFill').style.width = pct + '%';
    $('progressLabel').textContent = done + ' / ' + urls.length + ' checked';
    renderTable(getFiltered());
    updateStatusStats();
  }

  btn.disabled = false;
  btn.textContent = 'Check Status';
  setTimeout(() => $('progressBar').classList.remove('active'), 2000);
}

function updateStatusStats() {
  const total = DATA.length;
  const checked = Object.keys(statusMap).length;
  if (checked === 0) return;
  let ok = 0, redir = 0, client = 0, server = 0, err = 0;
  Object.values(statusMap).forEach(s => {
    if (s >= 200 && s < 300) ok++;
    else if (s >= 300 && s < 400) redir++;
    else if (s >= 400 && s < 500) client++;
    else if (s >= 500) server++;
    else err++;
  });
  $('stats').innerHTML =
    '<div class="stat"><div class="num">' + total + '</div><div class="label">Total URLs</div></div>' +
    '<div class="stat"><div class="num green">' + ok + '</div><div class="label">200 OK</div></div>' +
    '<div class="stat"><div class="num yellow">' + redir + '</div><div class="label">3xx Redirect</div></div>' +
    '<div class="stat"><div class="num red">' + client + '</div><div class="label">4xx Error</div></div>' +
    '<div class="stat"><div class="num red">' + server + '</div><div class="label">5xx Error</div></div>' +
    '<div class="stat"><div class="num">' + err + '</div><div class="label">Conn Error</div></div>';
}

function renderResults(json) {
  const { entries, sitemaps } = json;
  const sources = {};
  entries.forEach(e => { sources[e.source] = (sources[e.source] || 0) + 1; });

  $('stats').innerHTML =
    '<div class="stat"><div class="num">' + entries.length + '</div><div class="label">Total URLs</div></div>' +
    '<div class="stat"><div class="num">' + sitemaps.length + '</div><div class="label">Sub-Sitemaps</div></div>' +
    '<div class="stat"><div class="num">' + Object.keys(sources).length + '</div><div class="label">Source Files</div></div>' +
    '<div class="stat"><div class="num">' + entries.filter(e => e.images > 0).length + '</div><div class="label">With Images</div></div>' +
    '<div class="stat"><div class="num">' + entries.filter(e => e.hreflangs && e.hreflangs.length).length + '</div><div class="label">With Hreflang</div></div>';

  if (sitemaps.length > 0) {
    $('sitemapsPanel').style.display = 'block';
    $('sitemapsPanel').innerHTML = '<h3>Sub-Sitemaps (' + sitemaps.length + ')</h3>' +
      sitemaps.map(function(s) { return '<div class="row"><a href="' + s.url + '" target="_blank">' + s.url + '</a><span class="date">' + s.lastmod + '</span></div>'; }).join('');
  } else {
    $('sitemapsPanel').style.display = 'none';
  }

  const sel = $('sourceSelect');
  sel.innerHTML = '<option value="">All Sources</option>' +
    Object.entries(sources).map(function(kv) { return '<option value="' + kv[0] + '">' + kv[0] + ' (' + kv[1] + ')</option>'; }).join('');

  $('filterInput').value = '';
  $('statusSelect').value = '';
  sortCol = -1;
  renderTable(entries);
  $('results').classList.add('active');
}

function getFiltered() {
  const q = $('filterInput').value.toLowerCase();
  const src = $('sourceSelect').value;
  const st = $('statusSelect').value;
  return DATA.filter(function(e) {
    if (q && !e.url.toLowerCase().includes(q)) return false;
    if (src && e.source !== src) return false;
    if (st && statusCategory(e.url) !== st) return false;
    return true;
  });
}

function applyFilters() { renderTable(getFiltered()); }

function sortBy(col) {
  if (sortCol === col) sortAsc = !sortAsc;
  else { sortCol = col; sortAsc = true; }

  const keys = [null, 'url', '_status', 'source', 'lastmod', 'priority', 'images', 'hreflangs'];
  const key = keys[col];
  if (!key) return;

  const data = getFiltered();
  data.sort(function(a, b) {
    var va, vb;
    if (key === '_status') { va = statusMap[a.url] || 999; vb = statusMap[b.url] || 999; }
    else if (key === 'images') { va = a.images; vb = b.images; }
    else if (key === 'hreflangs') { va = (a.hreflangs||[]).length; vb = (b.hreflangs||[]).length; }
    else { va = a[key] || ''; vb = b[key] || ''; }
    if (typeof va === 'number') return sortAsc ? va - vb : vb - va;
    return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  document.querySelectorAll('th').forEach(function(th, i) {
    th.classList.toggle('sorted', i === col);
    var arr = th.querySelector('.arr');
    if (arr) arr.textContent = i === col ? (sortAsc ? '\\u25B2' : '\\u25BC') : '';
  });

  renderTable(data);
}

function renderTable(data) {
  var tbody = $('tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No URLs found</td></tr>';
    $('countLabel').textContent = '0 / ' + DATA.length;
    return;
  }
  tbody.innerHTML = data.map(function(e, i) {
    var langs = (e.hreflangs || []).map(function(h) { return '<span class="badge badge-lang">' + h.lang + '</span>'; }).join('');
    return '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td class="url-cell"><a href="' + e.url + '" target="_blank">' + e.url + '</a></td>' +
      '<td>' + statusBadge(e.url) + '</td>' +
      '<td><span class="badge badge-src">' + e.source + '</span></td>' +
      '<td>' + (e.lastmod !== '-' ? e.lastmod.substring(0, 10) : '-') + '</td>' +
      '<td>' + e.priority + '</td>' +
      '<td>' + (e.images > 0 ? e.images : '-') + '</td>' +
      '<td>' + (langs || '-') + '</td>' +
    '</tr>';
  }).join('');
  $('countLabel').textContent = data.length + ' / ' + DATA.length + ' URLs';
}

function copyUrls() {
  var urls = getFiltered().map(function(e) { return e.url; }).join('\\n');
  navigator.clipboard.writeText(urls).then(function() {
    var btns = document.querySelectorAll('.btn-secondary');
    btns[0].textContent = 'Copied!';
    setTimeout(function() { btns[0].textContent = 'Copy URLs'; }, 1500);
  });
}

function exportCSV() {
  var rows = [['URL', 'Status', 'Source', 'Last Modified', 'Changefreq', 'Priority', 'Images', 'Hreflang']];
  getFiltered().forEach(function(e) {
    rows.push([e.url, statusMap[e.url] !== undefined ? statusMap[e.url] : '', e.source, e.lastmod, e.changefreq, e.priority, e.images,
      (e.hreflangs || []).map(function(h) { return h.lang; }).join(';')]);
  });
  var csv = rows.map(function(r) { return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\\n');
  var blob = new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap_urls.csv';
  a.click();
}
</script>
</body>
</html>`;
