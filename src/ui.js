export const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sitemap Checker</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9784;</text></svg>">
<style>
  :root {
    --bg: #fafaf8;
    --surface: #ffffff;
    --surface-alt: #f5f4f1;
    --border: #e3e1dc;
    --border-light: #eceae5;
    --text: #2c2825;
    --text-secondary: #6b6560;
    --text-muted: #9c9690;
    --accent: #1a7f8a;
    --accent-hover: #15666f;
    --accent-subtle: #e8f4f5;
    --green: #2d7a3f;
    --green-bg: #eef6f0;
    --red: #b83a2e;
    --red-bg: #faf0ee;
    --amber: #a36216;
    --amber-bg: #fdf5e9;
    --gray-tag: #eae8e4;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.5;
  }

  /* ── Header ── */
  header {
    max-width: 600px;
    margin: 0 auto;
    padding: 72px 24px 40px;
    text-align: center;
  }
  header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    color: var(--text);
  }
  header p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  /* ── Search ── */
  .search {
    max-width: 560px;
    margin: 0 auto 48px;
    padding: 0 24px;
  }
  .search-row {
    display: flex;
    gap: 8px;
  }
  .search-row input {
    flex: 1;
    background: var(--surface);
    border: 1.5px solid var(--border);
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    color: var(--text);
    outline: none;
    transition: border-color .2s;
  }
  .search-row input:focus { border-color: var(--accent); }
  .search-row input::placeholder { color: var(--text-muted); }
  .search-row button {
    background: var(--text);
    color: var(--bg);
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background .15s;
    white-space: nowrap;
  }
  .search-row button:hover { background: #444; }
  .search-row button:disabled { opacity: .35; cursor: default; }

  /* ── Loader ── */
  .loader { display: none; text-align: center; padding: 64px 24px; }
  .loader.on { display: block; }
  .dot-loader { display: inline-flex; gap: 6px; margin-bottom: 16px; }
  .dot-loader span {
    width: 8px; height: 8px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce .6s alternate infinite;
  }
  .dot-loader span:nth-child(2) { animation-delay: .2s; }
  .dot-loader span:nth-child(3) { animation-delay: .4s; }
  @keyframes bounce { to { opacity: .3; transform: translateY(-4px); } }
  .loader p { color: var(--text-muted); font-size: .9rem; }

  /* ── Error ── */
  .error-msg {
    display: none;
    max-width: 560px;
    margin: 0 auto 24px;
    padding: 12px 16px;
    background: var(--red-bg);
    border: 1px solid #e5c8c4;
    border-radius: 6px;
    color: var(--red);
    text-align: center;
    font-size: .9rem;
  }
  .error-msg.on { display: block; }

  /* ── Results ── */
  .results { display: none; max-width: 1280px; margin: 0 auto; padding: 0 24px 64px; }
  .results.on { display: block; }

  /* ── Discovery info ── */
  .discovery-info {
    background: var(--accent-subtle);
    border: 1px solid #c8dfe1;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 20px;
    font-size: .84rem;
    color: var(--accent);
    line-height: 1.5;
  }
  .discovery-info code {
    background: rgba(26,127,138,.1);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: .8rem;
  }

  /* ── Numbers row ── */
  .numbers {
    display: flex;
    gap: 32px;
    margin-bottom: 28px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-light);
  }
  .num-item .val {
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .num-item .lbl {
    font-size: .78rem;
    color: var(--text-muted);
    margin-top: 2px;
  }
  .val-green { color: var(--green); }
  .val-red { color: var(--red); }
  .val-amber { color: var(--amber); }

  /* ── Sub-sitemaps ── */
  .sitemap-list {
    margin-bottom: 24px;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    background: var(--surface);
    overflow: hidden;
  }
  .sitemap-list summary {
    padding: 12px 16px;
    font-size: .85rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    user-select: none;
  }
  .sitemap-list summary:hover { color: var(--text); }
  .sm-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--border-light);
    font-size: .84rem;
  }
  .sm-row a { color: var(--accent); text-decoration: none; word-break: break-all; }
  .sm-row a:hover { text-decoration: underline; }
  .sm-row .date { color: var(--text-muted); font-size: .8rem; white-space: nowrap; margin-left: 16px; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
  }
  .toolbar input, .toolbar select {
    background: var(--surface);
    border: 1.5px solid var(--border);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: .85rem;
    font-family: inherit;
    outline: none;
    transition: border-color .15s;
  }
  .toolbar input:focus, .toolbar select:focus { border-color: var(--accent); }
  .toolbar input { flex: 1; min-width: 180px; }
  .toolbar select { min-width: 140px; }
  .toolbar .count {
    color: var(--text-muted);
    font-size: .8rem;
    margin-left: auto;
  }

  .tbtn {
    display: inline-flex;
    align-items: center;
    border: 1.5px solid var(--border);
    background: var(--surface);
    color: var(--text);
    padding: 8px 14px;
    border-radius: 6px;
    font-size: .84rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background .15s, border-color .15s;
    white-space: nowrap;
  }
  .tbtn:hover { background: var(--surface-alt); border-color: #ccc; }
  .tbtn:disabled { opacity: .4; cursor: default; }
  .tbtn-accent {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
  .tbtn-accent:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

  /* ── Progress ── */
  .pbar { display: none; margin-bottom: 20px; }
  .pbar.on { display: block; }
  .pbar-track { background: var(--border-light); border-radius: 3px; height: 3px; overflow: hidden; }
  .pbar-fill { background: var(--accent); height: 100%; width: 0%; transition: width .3s; border-radius: 3px; }
  .pbar-text { color: var(--text-muted); font-size: .78rem; margin-top: 6px; text-align: right; }

  /* ── Table ── */
  .table-wrap {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--surface);
  }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface-alt); }
  th {
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  th:hover { color: var(--text-secondary); }
  th .arr { font-size: .6rem; margin-left: 3px; }
  th.on { color: var(--accent); }
  th.on .arr { color: var(--accent); }
  td {
    padding: 9px 14px;
    font-size: .84rem;
    border-bottom: 1px solid var(--border-light);
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--surface-alt); }

  .url-td { max-width: 460px; word-break: break-all; }
  .url-td a { color: var(--accent); text-decoration: none; }
  .url-td a:hover { text-decoration: underline; }

  .src-tag {
    display: inline-block;
    background: var(--gray-tag);
    color: var(--text-secondary);
    padding: 2px 7px;
    border-radius: 4px;
    font-size: .74rem;
    font-weight: 500;
  }
  .lang-tag {
    display: inline-block;
    background: var(--accent-subtle);
    color: var(--accent);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: .72rem;
    font-weight: 500;
    margin: 1px 2px;
  }

  .st { font-size: .8rem; font-weight: 600; }
  .st-200 { color: var(--green); }
  .st-3xx { color: var(--amber); }
  .st-4xx { color: var(--red); }
  .st-5xx { color: var(--red); }
  .st-err { color: var(--text-muted); }
  .st-wait { color: var(--border); }

  .empty td { text-align: center; padding: 40px; color: var(--text-muted); }

  /* ── Footer ── */
  footer {
    text-align: center;
    padding: 32px 24px;
    font-size: .8rem;
    color: var(--text-muted);
    border-top: 1px solid var(--border-light);
    max-width: 1280px;
    margin: 0 auto;
  }
  footer a { color: var(--text-secondary); text-decoration: none; }
  footer a:hover { text-decoration: underline; }

  @media (max-width: 640px) {
    header { padding: 48px 20px 28px; }
    header h1 { font-size: 1.4rem; }
    .numbers { gap: 20px; }
    .num-item .val { font-size: 1.3rem; }
    td, th { padding: 7px 10px; font-size: .8rem; }
  }
</style>
</head>
<body>

<header>
  <h1>Sitemap Checker</h1>
  <p>Paste any URL &mdash; a sitemap.xml, a homepage, or even just a domain. We'll find the sitemaps automatically.</p>
</header>

<div class="search">
  <div class="search-row">
    <input type="text" id="urlInput" placeholder="example.com or example.com/sitemap.xml" autofocus>
    <button id="crawlBtn" onclick="startCrawl()">Analyze</button>
  </div>
</div>

<div class="error-msg" id="error"></div>

<div class="loader" id="loader">
  <div class="dot-loader"><span></span><span></span><span></span></div>
  <p>Crawling sitemap...</p>
</div>

<div class="results" id="results">

  <div class="discovery-info" id="discoveryInfo" style="display:none"></div>
  <div class="numbers" id="numbers"></div>

  <details class="sitemap-list" id="smPanel" style="display:none">
    <summary id="smTitle"></summary>
    <div id="smBody"></div>
  </details>

  <div class="pbar" id="pbar">
    <div class="pbar-track"><div class="pbar-fill" id="pFill"></div></div>
    <div class="pbar-text" id="pText"></div>
  </div>

  <div class="toolbar">
    <input type="text" id="fInput" placeholder="Filter..." oninput="applyFilters()">
    <select id="fSource" onchange="applyFilters()"><option value="">All sources</option></select>
    <select id="fStatus" onchange="applyFilters()">
      <option value="">All status</option>
      <option value="ok">200 OK</option>
      <option value="redirect">3xx</option>
      <option value="client">4xx</option>
      <option value="server">5xx</option>
      <option value="error">Error</option>
      <option value="pending">Unchecked</option>
    </select>
    <button class="tbtn tbtn-accent" id="stBtn" onclick="checkAll()">Check status</button>
    <button class="tbtn" onclick="copyUrls()">Copy</button>
    <button class="tbtn" onclick="exportCSV()">CSV</button>
    <span class="count" id="countLabel"></span>
  </div>

  <div class="table-wrap">
    <div class="table-scroll">
      <table>
        <thead><tr>
          <th onclick="sortBy(0)">#<span class="arr"></span></th>
          <th onclick="sortBy(1)">URL<span class="arr"></span></th>
          <th onclick="sortBy(2)">Status<span class="arr"></span></th>
          <th onclick="sortBy(3)">Source<span class="arr"></span></th>
          <th onclick="sortBy(4)">Modified<span class="arr"></span></th>
          <th onclick="sortBy(5)">Priority<span class="arr"></span></th>
          <th onclick="sortBy(6)">Img<span class="arr"></span></th>
          <th onclick="sortBy(7)">Lang<span class="arr"></span></th>
        </tr></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>
</div>

<footer>
  <a href="https://github.com/aliarifsoydas/sitemap-checker" target="_blank">Source on GitHub</a>
</footer>

<script>
var DATA=[], SM={}, sortCol=-1, sortAsc=true;
var $=function(id){return document.getElementById(id)};

$('urlInput').addEventListener('keydown',function(e){if(e.key==='Enter')startCrawl()});

async function startCrawl(){
  var url=$('urlInput').value.trim();
  if(!url)return;
  off('error');off('results');off('pbar');
  on('loader');
  $('crawlBtn').disabled=true;
  SM={};
  try{
    var r=await fetch('/api/crawl',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url})});
    var j=await r.json();
    if(!r.ok)throw new Error(j.error||'Failed');
    DATA=j.entries;
    showResults(j);
  }catch(e){
    $('error').textContent=e.message;
    on('error');
  }finally{
    off('loader');
    $('crawlBtn').disabled=false;
  }
}

function stHtml(url){
  var s=SM[url];
  if(s===undefined)return'<span class="st st-wait">&mdash;</span>';
  if(s===0)return'<span class="st st-err">err</span>';
  if(s>=200&&s<300)return'<span class="st st-200">'+s+'</span>';
  if(s>=300&&s<400)return'<span class="st st-3xx">'+s+'</span>';
  if(s>=400&&s<500)return'<span class="st st-4xx">'+s+'</span>';
  return'<span class="st st-5xx">'+s+'</span>';
}
function stCat(url){
  var s=SM[url];
  if(s===undefined)return'pending';
  if(s===0)return'error';
  if(s>=200&&s<300)return'ok';
  if(s>=300&&s<400)return'redirect';
  if(s>=400&&s<500)return'client';
  return'server';
}

async function checkAll(){
  var btn=$('stBtn');
  btn.disabled=true;btn.textContent='Checking...';
  on('pbar');
  var urls=DATA.map(function(e){return e.url});
  var batch=30,done=0;
  for(var i=0;i<urls.length;i+=batch){
    var chunk=urls.slice(i,i+batch);
    try{
      var r=await fetch('/api/check-status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({urls:chunk})});
      var j=await r.json();
      if(j.results)j.results.forEach(function(x){SM[x.url]=x.status});
    }catch(e){chunk.forEach(function(u){if(!(u in SM))SM[u]=0})}
    done+=chunk.length;
    $('pFill').style.width=Math.min(100,Math.round(done/urls.length*100))+'%';
    $('pText').textContent=done+' / '+urls.length;
    renderTable(filtered());
    updateNums();
  }
  btn.disabled=false;btn.textContent='Check status';
  setTimeout(function(){off('pbar')},1500);
}

function updateNums(){
  var t=DATA.length,ok=0,re=0,cl=0,sv=0,er=0;
  Object.values(SM).forEach(function(s){
    if(s>=200&&s<300)ok++;else if(s>=300&&s<400)re++;else if(s>=400&&s<500)cl++;else if(s>=500)sv++;else er++;
  });
  $('numbers').innerHTML=
    num(t,'','Total')+num(ok,'val-green','OK')+num(re,'val-amber','Redirect')+num(cl,'val-red','4xx')+num(sv,'val-red','5xx')+num(er,'','Errors');
}

function num(v,c,l){return'<div class="num-item"><div class="val '+(c||'')+'">'+v+'</div><div class="lbl">'+l+'</div></div>'}

function showResults(json){
  var entries=json.entries,sitemaps=json.sitemaps;
  var src={};
  entries.forEach(function(e){src[e.source]=(src[e.source]||0)+1});

  // Show discovery info if sitemaps were auto-discovered
  var df=json.discoveredFrom;
  if(df&&df.length){
    var inputUrl=$('urlInput').value.trim();
    var isDirectXml=inputUrl.match(/\\.xml(\\?|$)/i);
    if(!isDirectXml){
      $('discoveryInfo').innerHTML='Found '+df.length+' sitemap'+(df.length>1?'s':'')+' from <code>'+inputUrl+'</code>: '+df.map(function(u){return'<code>'+u.split('/').pop()+'</code>'}).join(', ');
      $('discoveryInfo').style.display='';
    }else{$('discoveryInfo').style.display='none'}
  }else{$('discoveryInfo').style.display='none'}

  $('numbers').innerHTML=
    num(entries.length,'','Total')+
    num(sitemaps.length,'','Sitemaps')+
    num(Object.keys(src).length,'','Sources')+
    num(entries.filter(function(e){return e.images>0}).length,'','Images')+
    num(entries.filter(function(e){return e.hreflangs&&e.hreflangs.length}).length,'','Hreflang');

  if(sitemaps.length){
    $('smPanel').style.display='';
    $('smTitle').textContent=sitemaps.length+' sub-sitemaps';
    $('smBody').innerHTML=sitemaps.map(function(s){
      return'<div class="sm-row"><a href="'+s.url+'" target="_blank">'+s.url+'</a><span class="date">'+s.lastmod+'</span></div>';
    }).join('');
  }else{$('smPanel').style.display='none'}

  $('fSource').innerHTML='<option value="">All sources</option>'+
    Object.entries(src).map(function(kv){return'<option value="'+kv[0]+'">'+kv[0]+' ('+kv[1]+')</option>'}).join('');

  $('fInput').value='';$('fStatus').value='';
  sortCol=-1;
  renderTable(entries);
  on('results');
}

function filtered(){
  var q=$('fInput').value.toLowerCase(),src=$('fSource').value,st=$('fStatus').value;
  return DATA.filter(function(e){
    if(q&&e.url.toLowerCase().indexOf(q)===-1)return false;
    if(src&&e.source!==src)return false;
    if(st&&stCat(e.url)!==st)return false;
    return true;
  });
}
function applyFilters(){renderTable(filtered())}

function sortBy(col){
  if(sortCol===col)sortAsc=!sortAsc;else{sortCol=col;sortAsc=true}
  var keys=[null,'url','_st','source','lastmod','priority','images','hreflangs'];
  var key=keys[col];if(!key)return;
  var d=filtered();
  d.sort(function(a,b){
    var va,vb;
    if(key==='_st'){va=SM[a.url]||999;vb=SM[b.url]||999}
    else if(key==='images'){va=a.images;vb=b.images}
    else if(key==='hreflangs'){va=(a.hreflangs||[]).length;vb=(b.hreflangs||[]).length}
    else{va=a[key]||'';vb=b[key]||''}
    if(typeof va==='number')return sortAsc?va-vb:vb-va;
    return sortAsc?String(va).localeCompare(String(vb)):String(vb).localeCompare(String(va));
  });
  document.querySelectorAll('th').forEach(function(th,i){
    th.classList.toggle('on',i===col);
    var a=th.querySelector('.arr');
    if(a)a.textContent=i===col?(sortAsc?'\\u25B2':'\\u25BC'):'';
  });
  renderTable(d);
}

function renderTable(d){
  var tb=$('tbody');
  if(!d.length){tb.innerHTML='<tr class="empty"><td colspan="8">No results</td></tr>';$('countLabel').textContent='0';return}
  tb.innerHTML=d.map(function(e,i){
    var langs=(e.hreflangs||[]).map(function(h){return'<span class="lang-tag">'+h.lang+'</span>'}).join('');
    return'<tr>'+
      '<td>'+(i+1)+'</td>'+
      '<td class="url-td"><a href="'+e.url+'" target="_blank">'+e.url+'</a></td>'+
      '<td>'+stHtml(e.url)+'</td>'+
      '<td><span class="src-tag">'+e.source+'</span></td>'+
      '<td>'+(e.lastmod!=='-'?e.lastmod.substring(0,10):'-')+'</td>'+
      '<td>'+e.priority+'</td>'+
      '<td>'+(e.images>0?e.images:'-')+'</td>'+
      '<td>'+(langs||'-')+'</td>'+
    '</tr>';
  }).join('');
  $('countLabel').textContent=d.length+' / '+DATA.length;
}

function copyUrls(){
  var u=filtered().map(function(e){return e.url}).join('\\n');
  navigator.clipboard.writeText(u).then(function(){
    var b=document.querySelectorAll('.tbtn:not(.tbtn-accent)')[0];
    var o=b.textContent;b.textContent='Done';
    setTimeout(function(){b.textContent=o},1000);
  });
}

function exportCSV(){
  var rows=[['URL','Status','Source','Last Modified','Changefreq','Priority','Images','Hreflang']];
  filtered().forEach(function(e){
    rows.push([e.url,SM[e.url]!==undefined?SM[e.url]:'',e.source,e.lastmod,e.changefreq,e.priority,e.images,
      (e.hreflangs||[]).map(function(h){return h.lang}).join(';')]);
  });
  var csv=rows.map(function(r){return r.map(function(c){return'"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\\n');
  var blob=new Blob(['\\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='sitemap_urls.csv';a.click();
}

function on(id){$(id).classList.add('on')}
function off(id){$(id).classList.remove('on')}
</script>
</body>
</html>`;
